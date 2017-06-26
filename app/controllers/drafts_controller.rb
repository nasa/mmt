class DraftsController < ManageMetadataController
  include ManageMetadataHelper

  before_action :set_draft, only: [:show, :edit, :update, :destroy, :publish]
  before_action :load_umm_schema, only: [:edit, :show]
  before_filter :ensure_correct_draft_provider, only: [:edit, :show]

  add_breadcrumb 'Drafts', :drafts_path

  RESULTS_PER_PAGE = 25

  # GET /drafts
  # GET /drafts.json
  def index
    @drafts = current_user.drafts.where(provider_id: current_user.provider_id)
                                  .order('updated_at DESC').page(params[:page]).per(RESULTS_PER_PAGE)
  end

  # GET /drafts/1
  # GET /drafts/1.json
  def show
    set_platform_types
    set_temporal_keywords
    set_data_centers
    set_country_codes
    set_language_codes
    @errors = validate_metadata

    add_breadcrumb display_entry_id(@draft.draft, 'draft'), draft_path(@draft)
  end

  # GET /drafts/new
  def new
    @draft = Draft.new(user: current_user, draft: {}, id: 0)
    render :show

    add_breadcrumb 'New', new_draft_path
  end

  # GET /drafts/1/edit
  def edit
    add_breadcrumb display_entry_id(@draft.draft, 'draft'), draft_path(@draft)

    Rails.logger.info("Audit Log: User #{current_user.urs_uid} started to modify draft #{@draft.entry_title} for provider #{current_user.provider_id}")

    if params[:form]
      @draft_form = params[:form]
      set_science_keywords
      set_location_keywords
      set_platform_types if params[:form] == 'acquisition_information'
      set_language_codes if params[:form] == 'metadata_information' || params[:form] == 'collection_information'
      set_country_codes
      set_temporal_keywords if params[:form] == 'temporal_information'
      set_data_centers if params[:form] == 'data_centers' || params[:form] == 'data_contacts'
      load_data_contacts_schema if params[:form] == 'data_contacts'

      add_breadcrumb @draft_form.titleize, edit_draft_path(@draft)
    else
      render :show
    end
  end

  # PATCH/PUT /drafts/1
  # PATCH/PUT /drafts/1.json
  def update
    if params[:id] == '0'
      @draft = Draft.create(user: current_user, provider_id: current_user.provider_id, draft: {})
      Rails.logger.info("Audit Log: #{current_user.urs_uid} created draft #{@draft.entry_title} for provider #{current_user.provider_id}")
      params[:id] = @draft.id
    else
      @draft = Draft.find(params[:id])
    end

    if @draft.update_draft(params[:draft], current_user.urs_uid)
      flash[:success] = 'Draft was successfully updated.'

      case params[:commit]
      when 'Done'
        redirect_to @draft
      when 'Next', 'Previous'
        # Determine next form to go to
        next_form_name = Draft.get_next_form(params['next_section'], params[:commit])
        redirect_to draft_edit_form_path(@draft, next_form_name)
      when 'Save'
        # tried to use render to avoid another request, but could not get form name in url even with passing in location
        @draft_form = params['next_section']
        redirect_to draft_edit_form_path(@draft, @draft_form)
      else # Jump directly to a form
        next_form_name = params['new_form_name']
        redirect_to draft_edit_form_path(@draft, next_form_name)
      end
    else # record update failed
      # render 'edit' # this should get @draft_form
      # Remove
      flash[:error] = 'Draft was not updated successfully.'
      redirect_to @draft
    end
  end

  # DELETE /drafts/1
  # DELETE /drafts/1.json
  def destroy
    # if new_record?, no need to destroy
    @draft.destroy unless @draft.new_record?
    Rails.logger.info("Audit Log: Draft #{@draft.entry_title} was destroyed by #{current_user.urs_uid} in provider: #{current_user.provider_id}")
    respond_to do |format|
      flash[:success] = 'Draft was successfully deleted.'
      format.html { redirect_to manage_metadata_path }
    end
  end

  def publish
    @draft.add_metadata_dates

    draft = @draft.draft

    ingested = cmr_client.ingest_collection(draft.to_json, @draft.provider_id, @draft.native_id, token)

    if ingested.success?
      # get information for publication email notification before draft is deleted
      Rails.logger.info("Audit Log: Draft #{@draft.entry_title} was published by #{current_user.urs_uid} in provider: #{current_user.provider_id}")
      user_info = get_user_info
      short_name = @draft.draft['ShortName']
      version = @draft.draft['Version']

      # Delete draft
      @draft.destroy

      concept_id = ingested.body['concept-id']
      revision_id = ingested.body['revision-id']

      # instantiate and deliver notification email
      DraftMailer.draft_published_notification(user_info, concept_id, revision_id, short_name, version).deliver_now

      redirect_to collection_path(concept_id, revision_id: revision_id), flash: { success: 'Draft was successfully published.' }
    else
      # Log error message
      Rails.logger.error("Ingest Metadata Error: #{ingested.inspect}")
      Rails.logger.info("User #{current_user.urs_uid} attempted to ingest draft #{@draft.entry_title} in provider #{current_user.provider_id} but encountered an error.")
      @ingest_errors = generate_ingest_errors(ingested)

      flash[:error] = 'Draft was not published successfully.'
      render :show
    end
  end

  def subregion_options
    render partial: 'drafts/forms/fields/subregion_select'
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_draft
    id = params[:draft_id] || params[:id]
    if id == '0'
      @draft = Draft.new(user: current_user, draft: {}, id: 0)
    else
      @draft = Draft.find(id)
    end
    @draft_forms = Draft::DRAFT_FORMS
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def draft_params
    params.require(:draft).permit(:user_id, :draft)
  end

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
    return if @draft.provider_id == current_user.provider_id || @draft.new_record?

    @draft_action = request.original_url.include?('edit') ? 'edit' : 'view'
    @draft_form = params[:form] ? params[:form] : nil

    if current_user.available_providers.include?(@draft.provider_id)
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

    errors = Array.wrap(JSON::Validator.fully_validate(@json_schema, @draft.draft))
    errors = validate_parameter_ranges(errors, @draft.draft)
    @errors_before_generate = validate_picklists(errors, @draft.draft)
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

  def get_user_info
    user = {}
    user[:name] = session[:name]
    user[:email] = session[:email_address]
    user
  end
end
