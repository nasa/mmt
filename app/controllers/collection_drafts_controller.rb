# :nodoc:
class CollectionDraftsController < BaseDraftsController
  include DraftsHelper
  before_action :set_resource, only: [:show, :edit, :update, :destroy, :publish]
  before_action :load_umm_schema, only: [:new, :edit, :show]
  before_filter :ensure_correct_draft_provider, only: [:edit, :show]

  def new
    set_resource(CollectionDraft.new(user: current_user, provider_id: current_user.provider_id, draft: {}))
    @draft_forms = CollectionDraft.forms
    @draft_form = params[:form] || @draft_forms.first

    add_breadcrumb 'New', new_collection_draft_path

    set_science_keywords
    set_location_keywords
    set_country_codes
    set_language_codes

    @errors = validate_metadata
  end

  def show
    super

    set_platform_types
    set_temporal_keywords
    set_data_centers
    set_country_codes
    set_language_codes
    @errors = validate_metadata
  end

  def edit
    add_breadcrumb display_entry_id(get_resource.draft, 'draft'), collection_draft_path(get_resource)

    Rails.logger.info("Audit Log: User #{current_user.urs_uid} started to modify draft #{get_resource.entry_title} for provider #{current_user.provider_id}")

    @draft_forms = CollectionDraft.forms

    # `form` is optional so if its not provided just use the first form
    @draft_form = params[:form] || @draft_forms.first

    add_breadcrumb titleize_form_name(@draft_form), edit_collection_draft_path(get_resource)

    # Set instance variables depending on the form requested
    set_science_keywords
    set_location_keywords
    set_platform_types if @draft_form == 'acquisition_information'
    set_language_codes if @draft_form == 'metadata_information' || @draft_form == 'collection_information'
    set_country_codes
    set_temporal_keywords if @draft_form == 'temporal_information'
    set_data_centers if @draft_form == 'data_centers' || @draft_form == 'data_contacts'
    load_data_contacts_schema if @draft_form == 'data_contacts'
  end

  def create
    set_resource(resource_class.new(user: current_user, provider_id: current_user.provider_id, draft: {}))

    if get_resource.save && get_resource.update_draft(params[:draft], current_user.urs_uid)
      flash[:success] = I18n.t("controllers.draft.#{plural_resource_name}.create.flash.success")

      case params[:commit]
      when 'Done'
        redirect_to get_resource
      when 'Next', 'Previous'
        # Determine next form to go to
        next_form_name = CollectionDraft.get_next_form(params['next_section'], params[:commit])
        redirect_to edit_collection_draft_path(get_resource, next_form_name)
      when 'Save'
        # tried to use render to avoid another request, but could not get form name in url even with passing in location
        get_resource_form = params['next_section']
        redirect_to edit_collection_draft_path(get_resource, get_resource_form)
      else # Jump directly to a form
        next_form_name = params['new_form_name']
        redirect_to edit_collection_draft_path(get_resource, next_form_name)
      end
    else # record update failed
      flash[:error] = I18n.t("controllers.draft.#{plural_resource_name}.create.flash.error")
      render :new
    end
  end

  def update
    if get_resource.update_draft(params[:draft], current_user.urs_uid)
      flash[:success] = I18n.t("controllers.draft.#{plural_resource_name}.update.flash.success")

      case params[:commit]
      when 'Done'
        redirect_to get_resource
      when 'Next', 'Previous'
        # Determine next form to go to
        next_form_name = CollectionDraft.get_next_form(params['next_section'], params[:commit])
        redirect_to edit_collection_draft_path(get_resource, next_form_name)
      when 'Save'
        # tried to use render to avoid another request, but could not get form name in url even with passing in location
        get_resource_form = params['next_section']
        redirect_to edit_collection_draft_path(get_resource, get_resource_form)
      else # Jump directly to a form
        next_form_name = params['new_form_name']
        redirect_to edit_collection_draft_path(get_resource, next_form_name)
      end
    else # record update failed
      # render 'edit' # this should get get_resource_form
      # Remove
      flash[:error] = I18n.t("controllers.draft.#{plural_resource_name}.update.flash.error")
      render :edit
    end
  end

  def publish
    get_resource.add_metadata_dates

    draft = get_resource.draft

    ingested = cmr_client.ingest_collection(draft.to_json, get_resource.provider_id, get_resource.native_id, token)

    if ingested.success?
      # get information for publication email notification before draft is deleted
      Rails.logger.info("Audit Log: Draft #{get_resource.entry_title} was published by #{current_user.urs_uid} in provider: #{current_user.provider_id}")
      short_name = get_resource.draft['ShortName']
      version = get_resource.draft['Version']

      # Delete draft
      get_resource.destroy

      concept_id = ingested.body['concept-id']
      revision_id = ingested.body['revision-id']

      # instantiate and deliver notification email
      DraftMailer.draft_published_notification(get_user_info, concept_id, revision_id, short_name, version).deliver_now

      redirect_to collection_path(concept_id, revision_id: revision_id), flash: { success: I18n.t("controllers.draft.#{plural_resource_name}.publish.flash.success") }
    else
      # Log error message
      Rails.logger.error("Ingest Metadata Error: #{ingested.inspect}")
      Rails.logger.info("User #{current_user.urs_uid} attempted to ingest draft #{get_resource.entry_title} in provider #{current_user.provider_id} but encountered an error.")
      @ingest_errors = generate_ingest_errors(ingested)

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
    params.require(:draft).permit(:user_id, :draft, :short_name, :entry_title, :provider_id, :native_id, :draft_type)
  end

  private

  def load_umm_schema
    # if provider file exists
    if File.exist?(File.join(Rails.root, 'lib', 'assets', 'provider_schemas', "#{current_user.provider_id.downcase}.json"))
      provider_schema = JSON.parse(File.read(File.join(Rails.root, 'lib', 'assets', 'provider_schemas', "#{current_user.provider_id.downcase}.json")))
      umm_schema = JSON.parse(File.read(File.join(Rails.root, 'lib', 'assets', 'schemas', 'umm-c-merged.json')))

      begin
        @json_schema = umm_schema.deep_merge(provider_schema)
      rescue JSON::ParserError > e
        # something wrong happened merging the schemas
        logger.info "#{current_user.provider_id.downcase}.json could not be merged successfully."
        @json_schema = umm_schema
      end
    else
      @json_schema = JSON.parse(File.read(File.join(Rails.root, 'lib', 'assets', 'schemas', 'umm-c-merged.json')))
    end
  end

  def load_data_contacts_schema
    @data_contacts_form_json_schema = JSON.parse(File.read(File.join(Rails.root, 'lib', 'assets', 'schemas', 'data-contacts-form-json-schema-2.json')))
  end

  def ensure_correct_draft_provider
    return if get_resource.provider_id == current_user.provider_id || get_resource.new_record?

    @draft_action = request.original_url.include?('edit') ? 'edit' : 'view'
    @draft_form = params[:form] ? params[:form] : nil

    if current_user.available_providers.include?(get_resource.provider_id)
      @user_permissions = 'wrong_provider'
    else
      @user_permissions = 'none'
    end
    render :show
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
    errors = validate_parameter_ranges(errors, get_resource.draft)
    @errors_before_generate = validate_picklists(errors, get_resource.draft)
    @errors_before_generate.map { |error| generate_show_errors(error) }.flatten
  end

  # These errors are generated by our JSON Schema validation
  def generate_show_errors(string)
    fields = string.match(/'#\/(.*?)'/).captures.first

    if string.include? 'did not contain a required property'
      required_field = string.match(/contain a required property of '(.*)'/).captures.first

      field = fields.split('/')
      top_field = field[0] || required_field

      {
        field: required_field,
        top_field: top_field,
        page: get_page(field),
        error: 'is required'
      }

    # If the error is not about required fields
    else
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
    when /larger than/
      'is larger than ParameterRangeBegin'
    end
  end

  def validate_parameter_ranges(errors, metadata)
    if metadata['AdditionalAttributes']
      metadata['AdditionalAttributes'].each do |attribute|
        non_range_types = %w(STRING BOOLEAN)
        unless non_range_types.include?(attribute['DataType'])
          range_begin = attribute['ParameterRangeBegin']
          range_end = attribute['ParameterRangeEnd']

          if range_begin && range_end && range_begin >= range_end
            error = "The property '#/AdditionalAttributes/0/ParameterRangeBegin' was larger than ParameterRangeEnd"
            errors << error
          end
        end
      end
    end

    errors
  end

  def validate_picklists(errors, metadata)
    # for each bad field, if the value doesn't appear in the picklist values, create an error
    # if/when there is time, it would be nice to refactor this with helper methods
    if metadata
      if metadata['ProcessingLevel'] && metadata['ProcessingLevel']['Id']
        unless DraftsHelper::ProcessingLevelIdOptions.flatten.include? metadata['ProcessingLevel']['Id']
          errors << "The property '#/ProcessingLevel/Id' was invalid"
        end
      end

      if metadata['CollectionProgress']
        unless DraftsHelper::CollectionProgressOptions.flatten.include? metadata['CollectionProgress']
          errors << "The property '#/CollectionProgress' was invalid"
        end
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

      # [RelatedURLs]
      # [DataCenters][][ContactInformation][RelatedURLs]
      # [DataCenters][][ContactGroups][][ContactInformation][RelatedURLs]
      # [DataCenters][][ContactPersons][][ContactInformation][RelatedURLs]
      related_urls = metadata.fetch('RelatedURLs', [])
      validate_related_urls_picklists(related_urls, errors)

      data_centers = metadata.fetch('DataCenters', [])
      data_centers.each do |data_center|
        contact_information = data_center.fetch('ContactInformation', {})
        validate_related_urls_picklists(contact_information.fetch('RelatedURLs', []), errors)

        contact_groups = data_center.fetch('ContactGroups', [])
        contact_groups.each do |contact_group|
          group_information = contact_group.fetch('ContactInformation', {})
          validate_related_urls_picklists(group_information.fetch('RelatedURLs', []), errors)
        end

        contact_persons = data_center.fetch('ContactPersons', [])
        contact_persons.each do |contact_person|
          person_information = contact_person.fetch('ContactInformation', {})
          validate_related_urls_picklists(person_information.fetch('RelatedURLs', []), errors)
        end
      end

      platforms = metadata['Platforms'] || []
      platforms.each do |platform|
        platform_type = platform['Type']
        if platform_type && !@platform_types.include?(platform_type)
          errors << "The property '#/Platforms' was invalid"
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
          matches = @data_centers.select { |dc| dc.include?(short_name) }
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
    end

    errors
  end

  def validate_related_urls_picklists(metadata, errors)
    metadata.each do |related_url|
      url_content_type = related_url['URLContentType']
      if url_content_type && !DraftsHelper::URLContentTypeOptions.flatten.include?(url_content_type)
        errors << "The property '#/RelatedUrls' was invalid"
      end

      type = related_url['Type']
      if type && !DraftsHelper::URLTypeOptions.flatten.include?(type)
        errors << "The property '#/RelatedUrls' was invalid"
      end

      subtype = related_url['Subtype']
      if subtype && !DraftsHelper::URLSubtypeOptions.flatten.include?(subtype)
        errors << "The property '#/RelatedUrls' was invalid"
      end

      if type == 'GET DATA'
        get_data = related_url.fetch('GetData', {})

        format = get_data['Format']
        if format && !DraftsHelper::GetDataTypeFormatOptions.flatten.include?(format)
          errors << "The property '#/RelatedUrls' was invalid"
        end

        unit = get_data['Unit']
        if unit && !DraftsHelper::FileSizeUnitTypeOptions.flatten.include?(unit)
          errors << "The property '#/RelatedUrls' was invalid"
        end
      elsif type == 'GET SERVICE'
        get_service = related_url.fetch('GetService', {})

        mime_type = get_service['MimeType']
        if mime_type && !DraftsHelper::MimeTypeOptions.flatten.include?(mime_type)
          errors << "The property '#/RelatedUrls' was invalid"
        end

        protocol = get_service['Protocol']
        if protocol && !DraftsHelper::ProtocolOptions.flatten.include?(protocol)
          errors << "The property '#/RelatedUrls' was invalid"
        end
      end
    end
  end

  def set_science_keywords
    @science_keywords = cmr_client.get_controlled_keywords('science_keywords') if params[:form] == 'descriptive_keywords'
  end

  def set_location_keywords
    @location_keywords = cmr_client.get_controlled_keywords('spatial_keywords') if params[:form] == 'spatial_information'
  end

  def set_platform_types
    @platform_types = cmr_client.get_controlled_keywords('platforms')['category'].map { |category| category['value'] }.sort
  end

  def set_language_codes
    @language_codes = cmr_client.get_language_codes.to_a
  end

  def set_country_codes
    # put the US at the top of the country list
    country_codes = Carmen::Country.all.sort
    united_states = country_codes.delete(Carmen::Country.named('United States'))
    @country_codes = country_codes.unshift(united_states)
  end

  def set_temporal_keywords
    keywords = cmr_client.get_controlled_keywords('temporal_keywords')['temporal_resolution_range']
    @temporal_keywords = keywords.map { |keyword| keyword['value'] }.sort
  end

  def get_data_center_short_names_long_names_urls(json, trios = [])
    json.each do |k, value|
      if k == 'short_name'
        value.each do |value2|
          short_name = value2['value']

          if value2['long_name'].nil?
            long_name = nil
            url = nil
          else
            long_name_hash = value2['long_name'][0]
            long_name = long_name_hash['value']
            url = long_name_hash['url'].nil? ? nil : long_name_hash['url'][0]['value']
          end

          trios.push [short_name, long_name, url]
        end

      elsif value.class == Array
        value.each do |value2|
          get_data_center_short_names_long_names_urls value2, trios if value2.class == Hash
        end
      elsif value.class == Hash
        get_data_center_short_names_long_names_urls value, trios
      end
    end
    trios
  end

  def set_data_centers
    data_centers = cmr_client.get_controlled_keywords('providers')
    data_centers = get_data_center_short_names_long_names_urls(data_centers)
    @data_centers = data_centers.sort
  end
end
