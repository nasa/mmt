# :nodoc:
class CollectionDraftsController < BaseDraftsController
  include DraftsHelper
  include ControlledKeywords
  include CMRCollectionsHelper
  include GKRKeywordRecommendations
  before_action :set_resource, only: [:download_json, :show, :edit, :update, :destroy, :publish]
  before_action :load_umm_c_schema, only: [:new, :edit, :show, :publish]
  before_action :collection_validation_setup, only: [:show, :publish]
  before_action :verify_valid_metadata, only: [:publish]
  before_action :set_associated_concepts, only: [:show]

  layout 'collection_preview', only: [:show]

  def new
    set_resource_by_model

    authorize get_resource

    new_view_setup

    @errors = validate_metadata
  end

  def show
    super

    @errors = validate_metadata
  end

  def download_json
    token = params[:token]
    if Rails.configuration.proposal_mode
      token_response = cmr_client.validate_dmmt_token(token)
    else
      token_response = cmr_client.validate_mmt_token(token)
    end
    if token_response.success?
      # Verify the user owns the draft
      json = token_response.body
      json = JSON.parse json if json.class == String # for some reason the mock isn't return hash but json.
      token_user_id = json["uid"]
      resource = get_resource
      user = User.find_by(id: resource.user_id)
      resource_user_id = user.urs_uid

      # If so produce the draft json record
      if resource_user_id == token_user_id
        render json: JSON.pretty_generate(get_resource.draft)
      else
        # Otherwise render an error
        render json: JSON.pretty_generate({"error": "Unauthorized"})
      end
    else
      render json: JSON.pretty_generate({"error": "invalid token"})
    end
  end

  def edit
    authorize get_resource

    edit_view_setup
  end

  def create
    set_resource_by_model

    authorize get_resource

    if get_resource.save && get_resource.update_draft(params[:draft], current_user.urs_uid)
      Rails.logger.info("Audit Log: #{current_user.urs_uid} successfully created #{resource_name.titleize} with title: '#{get_resource.entry_title}' and id: #{get_resource.id}#{Rails.configuration.proposal_mode ? '' : ' for provider: ' + current_user.provider_id}")
      flash[:success] = I18n.t("controllers.draft.#{plural_resource_name}.create.flash.success")
      case params[:commit]
      when 'Done'
        redirect_to get_resource
      when 'Next', 'Previous'
        # Determine next form to go to
        next_form_name = resource_class.get_next_form(params['next_section'], params[:commit])
        redirect_to send("edit_#{resource_name}_path", get_resource, next_form_name)
      when 'Save'
        # tried to use render to avoid another request, but could not get form name in url even with passing in location
        get_resource_form = params['next_section']
        redirect_to send("edit_#{resource_name}_path", get_resource, get_resource_form)
      else # Jump directly to a form
        next_form_name = params['new_form_name']
        redirect_to send("edit_#{resource_name}_path", get_resource, next_form_name)
      end
    else # record update failed
      flash[:error] = I18n.t("controllers.draft.#{plural_resource_name}.create.flash.error", error_message: generate_model_error)
      # For collection_template, the unsaved draft now has associated_dois which is a hash. This hash needs to be corrected/converted
      # to an array to work properly with _type.html.erb
      get_resource.correct_unsaved_draft if resource_name == 'collection_template'
      load_umm_c_schema
      new_view_setup
      render :new
    end
  end

  def update
    authorize get_resource

    if get_resource.update_draft(params[:draft], current_user.urs_uid)
      Rails.logger.info("Audit Log: Metadata update attempt when #{current_user.urs_uid} successfully modified #{resource_name.titleize} with title: '#{get_resource.entry_title}' and id: #{get_resource.id} for provider #{current_user.provider_id}")
      flash[:success] = I18n.t("controllers.draft.#{plural_resource_name}.update.flash.success")

      if gkr_enabled? && params[:recommended_keywords_viewed] == 'true'
        get_resource.record_recommendation_provided(params[:gkr_request_id], params[:recommended_keyword_list])
      end

      if params[:next_section] == 'descriptive_keywords' && get_resource.gkr_logging_active?
        log_gkr_on_save_keywords(current_user.urs_uid, current_user.provider_id, get_resource.draft.fetch('Abstract', ''),
          get_resource.gkr_keyword_recommendation_id, get_resource.gkr_keyword_recommendation_list,
          get_resource.draft.fetch('ScienceKeywords', []))
      end

      case params[:commit]
      when 'Done'
        redirect_to get_resource
      when 'Next', 'Previous'
        # Determine next form to go to
        next_form_name = resource_class.get_next_form(params['next_section'], params[:commit])
        redirect_to send("edit_#{resource_name}_path", get_resource, next_form_name)
      when 'Save'
        # tried to use render to avoid another request, but could not get form name in url even with passing in location
        get_resource_form = params['next_section']
        redirect_to send("edit_#{resource_name}_path", get_resource, get_resource_form)
      else # Jump directly to a form
        next_form_name = params['new_form_name']
        redirect_to send("edit_#{resource_name}_path", get_resource, next_form_name)
      end
    else # record update failed
      errors_list = generate_model_error
      Rails.logger.info("Audit Log: Metadata update attempt when #{current_user.urs_uid} unsuccessfully modified #{resource_name.titleize} with title: '#{get_resource.entry_title}' and id: #{get_resource.id} for provider #{current_user.provider_id} because of '#{errors_list}'")
      flash[:error] = I18n.t("controllers.draft.#{plural_resource_name}.update.flash.error", error_message: errors_list)
      load_umm_c_schema
      edit_view_setup
      render :edit
    end
  end

  def publish
    authorize get_resource

    get_resource.add_metadata_dates

    draft = get_resource.draft

    ingested_response = cmr_client.ingest_collection(draft.to_json, get_resource.provider_id, get_resource.native_id, token)

    if ingested_response.success?
      # get information for publication email notification before draft is deleted
      Rails.logger.info("Audit Log: Draft #{get_resource.entry_title} was published by #{current_user.urs_uid} in provider: #{current_user.provider_id}")
      short_name = get_resource.draft['ShortName']
      version = get_resource.draft['Version']
      log_gkr_on_publish(current_user.urs_uid, current_user.provider_id, get_resource.draft[:abstract],
        get_resource.gkr_keyword_recommendation_id, get_resource.gkr_keyword_recommendation_list,
        get_resource.draft.fetch("ScienceKeywords",[])) if get_resource.gkr_logging_active?


      # Delete draft
      get_resource.destroy

      concept_id = ingested_response.body['concept-id']
      revision_id = ingested_response.body['revision-id']

      # instantiate and deliver notification email
      DraftMailer.draft_published_notification(get_user_info, concept_id, revision_id, short_name, version).deliver_now

      redirect_to collection_path(concept_id, revision_id: revision_id), flash: { success: I18n.t("controllers.draft.#{plural_resource_name}.publish.flash.success") }
    else
      # Log error message
      Rails.logger.error("Ingest Collection Metadata Error: #{ingested_response.clean_inspect}")
      Rails.logger.info("User #{current_user.urs_uid} attempted to ingest collection draft #{get_resource.entry_title} in provider #{current_user.provider_id} but encountered an error.")

      @ingest_errors = generate_ingest_errors(ingested_response)
      flash[:error] = I18n.t("controllers.draft.#{plural_resource_name}.publish.flash.error")
      render :show
    end
  end

  def subregion_options
    render partial: 'collection_drafts/forms/fields/subregion_select'
  end

  # Returns the allowed parameters for pagination
  # @return [Hash]
  def collection_draft_params
    permitted = safe_hash(:draft)
  end

  private

  def load_umm_c_schema
    # if user has a provider set and provider file exists
    if current_user.provider_id && File.exist?(File.join(Rails.root, 'lib', 'assets', 'provider_schemas', "#{current_user.provider_id.downcase}.json"))
      provider_schema = JSON.parse(File.read(File.join(Rails.root, 'lib', 'assets', 'provider_schemas', "#{current_user.provider_id.downcase}.json")))
      umm_schema = JSON.parse(File.read(File.join(Rails.root, 'lib', 'assets', 'schemas', 'collections', 'umm-c-merged.json')))

      begin
        @json_schema = umm_schema.deep_merge(provider_schema)
      rescue JSON::ParserError > e
        # something wrong happened merging the schemas
        logger.info "#{current_user.provider_id.downcase}.json could not be merged successfully."
        @json_schema = umm_schema
      end
    else
      @json_schema = JSON.parse(File.read(File.join(Rails.root, 'lib', 'assets', 'schemas', 'collections', 'umm-c-merged.json')))
    end
  end

  def load_data_contacts_schema
    @data_contacts_form_json_schema = JSON.parse(File.read(File.join(Rails.root, 'lib', 'assets', 'schemas', 'collections', 'data-contacts-form-json-schema-2.json')))
  end

  def validate_metadata
    # Setup URI and date-time validation correctly
    uri_format_proc = lambda do |value|
      raise JSON::Schema::CustomFormatError.new('must be a valid URI') unless value.match URI_REGEX
    end
    JSON::Validator.register_format_validator('uri', uri_format_proc)
    date_time_format_proc = lambda do |value|
      raise JSON::Schema::CustomFormatError.new('must be a valid RFC3339 date/time string') unless value.match DATE_TIME_REGEX
    end
    JSON::Validator.register_format_validator('date-time', date_time_format_proc)

    errors = Array.wrap(JSON::Validator.fully_validate(@json_schema, get_resource.draft))
    errors = validate_paired_fields(errors, get_resource.draft)
    errors_before_generate = validate_picklists(errors, get_resource.draft)
    errors_before_generate.map { |error| generate_show_errors(error) }.reject(&:nil?).flatten
  end

  # These errors are generated by our JSON Schema validation
  def generate_show_errors(string)
    fields = string.match(/'#\/(.*?)'/).captures.first

    if string.include? 'did not contain a required property'
      # error is about required fields
      required_field = string.match(/contain a required property of '(.*)'/).captures.first
      field = fields.split('/')
      top_field = field[0] || required_field
      # For ArchiveAndDistributionInformation parent_field is needed to distinguish FileArchiveInformation or FileDistributionInformation
      parent_field = ''
      if top_field == 'ArchiveAndDistributionInformation'
        parent_field = field[1]
      end
      {
        field: required_field,
        parent_field: parent_field,
        top_field: top_field,
        page: get_page(field),
        error: 'is required'
      }

    else # If the error is not about required fields
      # if the last field is an array index, use the last section of the field path that isn't a number
      field = fields.split('/').select do |f|
        begin
          false if Float(f)
        rescue
          true
        end
      end
      {
        field: field.last,
        top_field: field[0],
        page: get_page(field),
        error: get_error(string)
      }
    end
  end

  def get_error(error)
    case error
    when /maximum string length/
      'is too long'
    when /maximum value/
      'is too high'
    when /must be a valid RFC3339 date\/time string/
      'is an invalid date format'
    when /did not match the regex/
      'is an invalid format'
    when /must be a valid URI/
      'is an invalid URI'
    when /larger than ParameterRangeEnd/
      'is larger than ParameterRangeEnd'
    when /larger than MaximumValue/
      'is larger than MaximumValue'
    when /later than EndDate/
      'is later than the End Date'
    when /later than Ending/
      'is later than the Ending Date Time'
    end
  end

  def validate_parameter_ranges(errors, metadata)
    Array.wrap(metadata['AdditionalAttributes'])&.each_with_index do |attribute, index|
      non_range_types = %w(STRING BOOLEAN)
      unless non_range_types.include?(attribute['DataType'])
        range_begin = attribute['ParameterRangeBegin']
        range_end = attribute['ParameterRangeEnd']

        if range_begin && range_end && range_begin >= range_end
          error = "The property '#/AdditionalAttributes/#{index}/ParameterRangeBegin' was larger than ParameterRangeEnd"
          errors << error
        end
      end
    end

    errors
  end

  def validate_paired_fields(errors, metadata)
    errors = validate_additional_attribute_value_field(errors, metadata)
    errors = validate_parameter_ranges(errors, metadata)
    errors = validate_project_paired_dates(errors, metadata)
    errors = validate_temporal_paired_dates(errors, metadata)
    validate_tiling_identification_systems_paired_fields(errors, metadata)
  end

  # The following regex are used to validate AdditionalAttributes/#{index}/DataType, as
  # these errors are not captured in the schema, they are business logic being
  # enforced in the CMR, and so they are being validated in collection_drafts_controller.rb;
  # They are strings instead of Regex literals so they can be more easily manipulated and
  # passed through to the Javascript;
  # CMR uses Java parsing functions and this regex is an approximation of their checks

  # The date and time regex match the following formats (the DATETIME_REGEX is just DATE_REGEX and TIME_REGEX combined)
  # Date:
    # yyyy-MM-dd
  # Time:
    # HH:mm:ss.SSSSSSSSSZ (where Z is zero offset, and of the form '±HH:mm' for non-zero offset) (up to 9 millisecond digits)
    # HH:mm:ssZ (where Z is zero offset, and of the form '±HH:mm' for non-zero offset)
    # HH:mm:ss.SSS (up to 3 millisecond digits)
    # HH:mm:ss

  FLOAT_REGEX = '^[+-]?\d+(\.\d+)?([eE][-+]?\d+)?[fFdD]?$'
  INT_REGEX = '^[-+]?\d+([eE][-+]?\d+)?$'
  DATE_REGEX = '^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$'
  TIME_REGEX = '^([01]?\d|2[0-3]):([0-5]?\d):([0-5]?\d)($|(Z|[-+]([01]\d|2[0-3]):([0-5]\d))$|\.\d{1,3}$|\.\d{1,9}(Z|[-+]([01]\d|2[0-3]):([0-5]\d))$)'
  DATETIME_REGEX = '^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))T([01]?\d|2[0-3]):([0-5]?\d):([0-5]?\d)($|(Z|[-+]([01]\d|2[0-3]):([0-5]\d))$|\.\d{1,3}$|\.\d{1,9}(Z|[-+]([01]\d|2[0-3]):([0-5]\d))$)'
  BOOL_REGEX = '^(false|true|1|0)$'

  def validate_additional_attribute_value_field(errors, metadata)
    additional_attributes = metadata.fetch('AdditionalAttributes',[])
    additional_attributes.each_with_index do |attribute, index|
      if (value = attribute['Value']) && (data_type = attribute['DataType'])
        value.strip!

        error_not_present = case data_type
        when 'FLOAT'
          value.match(Regexp.new(FLOAT_REGEX))
        when 'INT'
          value.match(Regexp.new(INT_REGEX))
        when 'BOOLEAN'
          value.match(Regexp.new(BOOL_REGEX))
        when 'DATE'
          value.match(Regexp.new(DATE_REGEX))
        when 'TIME'
          value.match(Regexp.new(TIME_REGEX))
        when 'DATETIME'
          value.match(Regexp.new(DATETIME_REGEX))
        else
          true
        end

        unless error_not_present
          error = "The property '#/AdditionalAttributes/#{index}/Value' is not a valid value of the supplied DataType"
          errors << error
        end
      end
    end

    errors
  end

  def validate_project_paired_dates(errors, metadata)
    projects = metadata['Projects']
    projects&.each_with_index do |project, index|
      start_date = project['StartDate']
      end_date = project['EndDate']

      if start_date && end_date && start_date > end_date
        error = "The property '#/Projects/#{index}/StartDate' is later than EndDate"
        errors << error
      end
    end

    errors
  end

  def validate_temporal_paired_dates(errors, metadata)
    extents = metadata['TemporalExtents']
    extents&.each_with_index do |extent, temporal_index|
      range_date_times = extent['RangeDateTimes']
      range_date_times&.each_with_index do |range_date_time, time_index|
        start_date = range_date_time['BeginningDateTime']
        end_date = range_date_time['EndingDateTime']

        if start_date && end_date && start_date > end_date
          error = "The property '#/TemporalExtents/#{temporal_index}/RangeDateTimes/#{time_index}/BeginningDateTime' is later than EndDate"
          errors << error
        end
      end
    end

    errors
  end

  def validate_tiling_identification_systems_paired_fields(errors, metadata)
    tiling_systems = metadata['TilingIdentificationSystems']
    tiling_systems&.each_with_index do |system, index|
      coordinate1_min = system.fetch('Coordinate1', {}).fetch('MinimumValue', nil)
      coordinate1_max = system.fetch('Coordinate1', {}).fetch('MaximumValue', nil)
      coordinate2_min = system.fetch('Coordinate2', {}).fetch('MinimumValue', nil)
      coordinate2_max = system.fetch('Coordinate2', {}).fetch('MaximumValue', nil)

      if coordinate1_min && coordinate1_max && coordinate1_min > coordinate1_max
        error = "The property '#/TilingIdentificationSystems/#{index}/Coordinate1/MinimumValue' is larger than MaximumValue"
        errors << error
      end

      if coordinate2_min && coordinate2_max && coordinate2_min > coordinate2_max
        error = "The property '#/TilingIdentificationSystems/#{index}/Coordinate2/MinimumValue' is larger than MaximumValue"
        errors << error
      end
    end

    errors
  end

  def validate_picklists(errors, metadata)
    # for each bad field, if the value doesn't appear in the picklist values, create an error
    # if/when there is time, it would be nice to refactor this with helper methods
    if metadata
      processing_level_id = metadata.dig('ProcessingLevel','Id')
      if processing_level_id && !DraftsHelper::ProcessingLevelIdOptions.flatten.include?(processing_level_id)
        errors << "The property '#/ProcessingLevel/Id' was invalid"
      end

      metadata_language = metadata['MetadataLanguage']
      if metadata_language
        matches = @language_codes.select { |language| language.include? metadata_language }
        if matches.empty?
          errors << "The property '#/MetadataLanguage' was invalid"
        end
      end

      data_language = metadata['DataLanguage']
      if data_language
        matches = @language_codes.select { |language| language.include? data_language }
        if matches.empty?
          errors << "The property '#/DataLanguage' was invalid"
        end
      end

      platforms = metadata['Platforms'] || []
      platforms.each do |platform|
        platform_short_name = platform['ShortName']

        if platform_short_name && !@platform_short_names.include?(platform_short_name)
          errors << "The property '#/Platforms' was invalid"
        end

        instruments = platform.fetch('Instruments', [])
        instruments.each do |instrument|
          instrument_short_name = instrument['ShortName']

          if instrument_short_name && !@instrument_short_names.include?(instrument_short_name)
            errors << "The property '#/Platforms' was invalid"
          end

          instrument_children = instrument.fetch('ComposedOf', [])
          instrument_children.each do |child|
            child_short_name = child['ShortName']

            if child_short_name && !@instrument_short_names.include?(child_short_name)
              errors << "The property '#/Platforms' was invalid"
            end
          end
        end
      end

      temporal_keywords = metadata['TemporalKeywords'] || []
      temporal_keywords.each do |keyword|
        if keyword && !@temporal_keywords.include?(keyword)
          errors << "The property '#/TemporalKeywords' was invalid"
        end
      end

      data_centers = metadata['DataCenters'] || []
      data_centers.each do |data_center|
        short_name = data_center['ShortName']
        if short_name
          matches = fetch_data_centers.select { |dc| dc[:short_name].include?(short_name) }
          if matches.empty?
            errors << "The property '#/DataCenters' was invalid"
          end
        end

        contact_information = data_center['ContactInformation'] || {}
        addresses = contact_information['Addresses'] || []
        addresses.each do |address|
          country = address['Country']
          if country
            matches = @country_codes.select { |option| option.name.include?(country) }
            if matches.empty?
              errors << "The property '#/DataCenters' was invalid"
            end
          end
        end
      end

      contact_persons = metadata['ContactPersons'] || []
      contact_persons.each do |contact_person|
        contact_information = contact_person['ContactInformation'] || {}
        addresses = contact_information['Addresses'] || []
        addresses.each do |address|
          country = address['Country']
          if country
            matches = @country_codes.select { |option| option.name.include?(country) }
            if matches.empty?
              errors << "The property '#/ContactPersons' was invalid"
            end
          end
        end
      end

      contact_groups = metadata['ContactGroups'] || []
      contact_groups.each do |contact_group|
        contact_information = contact_group['ContactInformation'] || {}
        addresses = contact_information['Addresses'] || []
        addresses.each do |address|
          country = address['Country']
          if country
            matches = @country_codes.select { |option| option.name.include?(country) }
            if matches.empty?
              errors << "The property '#/ContactGroups' was invalid"
            end
          end
        end
      end

      related_urls = metadata['RelatedUrls'] || []
      related_urls.each do |url|
        format = url.dig('GetData','Format')
        if format && !@granule_data_formats.include?(format)
          errors << "The property '#/RelatedUrls' was invalid"
        end
      end

      projects = metadata['Projects'] || []
      projects.each do |project|
        if project && @projects.none? { |proj| proj[:short_name] == project['ShortName'] }
          errors << "The property '#/Projects' was invalid"
        end
      end
    end

    errors
  end

  def set_language_codes
    @language_codes = cmr_client.get_language_codes.to_a
  end

  def new_view_setup
    @forms = resource_class.forms
    @form = params[:form] || @forms.first

    add_breadcrumb 'New', send("new_#{resource_name}_path")

    set_science_keywords
    set_location_keywords
    set_projects
    set_country_codes
    set_language_codes
    set_granule_data_formats
  end

  def edit_view_setup
    add_breadcrumb fetch_entry_id(get_resource.draft, resource_name), send("#{resource_name}_path", get_resource)

    Rails.logger.info("Audit Log: Metadata update attempt when #{current_user.urs_uid} started to modify #{resource_name.titleize} with title: '#{get_resource.entry_title}' and id: #{get_resource.id} for provider #{current_user.provider_id}")

    @forms = resource_class.forms

    # `form` is optional so if its not provided just use the first form
    @form = params[:form] || @forms.first

    add_breadcrumb titleize_form_name(@form), send("edit_#{resource_name}_path", get_resource)

    # Set instance variables depending on the form requested
    set_country_codes
    set_language_codes          if @form == 'collection_information' || @form == 'metadata_information'
    set_science_keywords        if @form == 'descriptive_keywords'
    set_keyword_recommendations if @form == 'descriptive_keywords' && gkr_enabled? && get_resource.keyword_recommendation_needed?
    set_platform_types          if @form == 'acquisition_information'
    set_instruments             if @form == 'acquisition_information'
    set_projects                if @form == 'acquisition_information'
    set_temporal_keywords       if @form == 'temporal_information'
    set_location_keywords       if @form == 'spatial_information'
    set_data_centers            if @form == 'data_centers' || @form == 'data_contacts'
    load_data_contacts_schema   if @form == 'data_contacts'
    set_granule_data_formats    if @form == 'related_urls' || @form == 'data_centers' || @form == 'data_contacts'
  end

  def reconcile_recommendations(keyword_recommendations)
    keyword_recommendations.reject do |recommendation|
      get_resource.draft.fetch('ScienceKeywords', []).any? do |science_keyword|
        keyword_string(science_keyword) == keyword_recommendation_string(recommendation)
      end
    end
  end

  def set_keyword_recommendations
    results = fetch_keyword_recommendations(current_user.urs_uid, request.uuid, current_user.provider_id)
    flash[:error] = "We are unable to retrieve keyword recommendations for request: #{request.uuid} at this time.  If this error persists, please contact support@earthdata.nasa.gov for additional support." if results[:error].present?
    return if results[:id].blank?

    @gkr_request_id = results[:id]
    @recommended_keywords = results[:recommendations]
    @keyword_recommendations = reconcile_recommendations(@recommended_keywords)
  end

  def collection_validation_setup
    set_platform_short_names
    set_instrument_short_names
    set_temporal_keywords
    set_country_codes
    set_language_codes
    set_granule_data_formats
    set_projects
  end

  def set_resource_by_model
    set_resource(CollectionDraft.new(user: current_user, provider_id: current_user.provider_id, draft: {}))
  end

  def generate_model_error
    return unless get_resource.errors.any?

    get_resource.errors.full_messages.reject(&:blank?).map(&:downcase).join(', ')
  end

  def verify_valid_metadata
    return if validate_metadata.blank?

    action = resource_name == 'collection_draft_proposal' ? 'submitted for review' : 'published'
    flash[:error] = "This collection can not be #{action}."
    redirect_to send("#{resource_name}_path", get_resource) and return
  end

  def set_associated_concepts
    # get collection
    collection_response = cmr_client.get_collections(native_id: get_resource.native_id)
    @services = [] && @tools = [] && return unless collection_response.success? && collection_response.body['hits'] > 0

    get_associated_concepts(collection_response.body['items'])
  end

  ## Feature Toggle for GKR recommendations
  def gkr_enabled?
    Rails.configuration.gkr_enabled
  end
end
