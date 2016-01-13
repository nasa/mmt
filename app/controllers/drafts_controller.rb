class DraftsController < ApplicationController
  before_action :set_draft, only: [:show, :edit, :update, :destroy, :publish]
  before_action :load_umm_schema, except: [:subregion_options]

  # GET /drafts
  # GET /drafts.json
  def index
    @drafts = @current_user.drafts.order('updated_at DESC')
  end

  # GET /drafts/1
  # GET /drafts/1.json
  def show
    @language_codes = cmr_client.get_language_codes

    schema = 'lib/assets/schemas/umm-c-json-schema.json'

    # Setup URI and date-time validation correctly
    uri_format_proc = lambda do |value|
      raise JSON::Schema::CustomFormatError.new('must be a valid URI') unless value.match URI_REGEX
    end
    JSON::Validator.register_format_validator('uri', uri_format_proc)
    date_time_format_proc = lambda do |value|
      raise JSON::Schema::CustomFormatError.new('must be a valid RFC3339 date/time string') unless value.match DATE_TIME_REGEX
    end
    JSON::Validator.register_format_validator('date-time', date_time_format_proc)

    errors = JSON::Validator.fully_validate(schema, @draft.draft)
    errors = Array.wrap(errors)
    errors = validate_parameter_ranges(errors, @draft.draft)
    errors.map! { |error| generate_show_errors(error) }.flatten!
    @errors = errors
  end

  # GET /drafts/new
  def new
    @draft = Draft.new(user: @current_user, draft: {}, id: 0)
    render :show
  end

  # GET /drafts/1/edit
  def edit
    if params[:form]
      @draft_form = params[:form]
      @science_keywords = cmr_client.get_science_keywords if params[:form] == 'descriptive_keywords'
      @spatial_keywords = cmr_client.get_spatial_keywords if params[:form] == 'spatial_information'
      if params[:form] == 'metadata_information' || params[:form] == 'collection_information'
        @language_codes = cmr_client.get_language_codes
      end

      # put the US at the top of the country list
      country_codes = Carmen::Country.all.sort
      united_states = country_codes.delete(Carmen::Country.named('United States'))
      @country_codes = country_codes.unshift(united_states)

      if params[:form] == 'temporal_information'
        keywords = cmr_client.get_temporal_keywords['temporal_resolution_range']
        @temporal_keywords = keywords.map { |keyword| keyword['value'] }
      end
    else
      render action: 'show'
    end
  end

  # PATCH/PUT /drafts/1
  # PATCH/PUT /drafts/1.json
  def update
    if params[:id] == '0'
      @draft = Draft.create(user: @current_user, draft: {})
      params[:id] = @draft.id
    else
      @draft = Draft.find(params[:id])
    end

    if @draft.update_draft(params[:draft])
      flash[:success] = 'Draft was successfully updated'

      case params[:commit]
      when 'Save & Done'
        redirect_to @draft
      when 'Save & Next'
        # Determine next form to go to
        next_form_name = Draft.get_next_form(params['next_section'])
        redirect_to draft_edit_form_path(@draft, next_form_name)
      else # Jump directly to a form
        next_form_name = params['new_form_name']
        redirect_to draft_edit_form_path(@draft, next_form_name)
      end
    else # record update failed
      # render 'edit' # this should get @draft_form
      # Remove
      flash[:error] = 'Draft was not updated successfully'
      redirect_to @draft
    end
  end

  # DELETE /drafts/1
  # DELETE /drafts/1.json
  def destroy
    # if new_record?, no need to destroy
    @draft.destroy unless @draft.new_record?
    respond_to do |format|
      flash[:success] = 'Draft was successfully deleted'
      format.html { redirect_to dashboard_url }
    end
  end

  def publish
    @draft.add_metadata_dates

    draft = @draft.draft

    ingested = cmr_client.ingest_collection(draft.to_json, @current_user.provider_id, @draft.native_id, token)

    if ingested.success?
      xml = MultiXml.parse(ingested.body)
      concept_id = xml['result']['concept_id']
      revision_id = xml['result']['revision_id']
      flash[:success] = 'Draft was successfully published'
      redirect_to collection_path(concept_id, revision_id: revision_id)
    else
      # Log error message
      Rails.logger.error("Ingest Metadata Error: #{ingested.inspect}")

      errors = ingested.body['errors']
      errors.select { |error| error['path'] }

      if errors.size > 0
        @ingest_errors = generate_ingest_errors(errors)
      else
        @ingest_errors = [{
          page: nil,
          field: nil,
          error: 'An unknown error caused publishing to fail.'
        }]
      end

      flash[:error] = 'Draft was not published successfully'
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
      @draft = Draft.new(user: @current_user, draft: {}, id: 0)
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
    @json_schema = JSON.parse(File.read(File.join(Rails.root, 'lib', 'assets', 'schemas', 'umm-c-merged.json')))
  end

  def generate_ingest_errors(errors)
    errors.map do |error|
      path = error['path'].first
      error = error['errors'].first
      {
        field: path,
        top_field: path,
        page: get_page(path),
        error: error
      }
    end
  end

  # These errors are generated by our JSON Schema validation
  def generate_show_errors(string)
    fields = string.match(/'#\/(.*?)'/).captures.first

    if string.include? 'did not contain a required property'
      required_field = string.match(/contain a required property of '(.*)'/).captures.first

      top_field = fields.split('/')[0] || required_field

      {
        field: required_field,
        top_field: top_field,
        page: get_page(top_field),
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
        page: get_page(field[0]),
        error: get_error(string)
      }
    end
  end

  ACQUISITION_INFORMATION_FIELDS = %w(
    Platforms
    Projects
  )
  COLLECTION_INFORMATION_FIELDS = %w(
    ShortName
    Version
    EntryTitle
    Abstract
    Purpose
    DataLanguage
  )
  COLLECTION_CITATIONS_FIELDS = %w(
    CollectionCitations
  )
  DATA_IDENTIFICATION_FIELDS = %w(
    DataDates
    CollectionDataType
    ProcessingLevel
    CollectionProgress
    Quality
    UseConstraints
    AccessConstraints
    MetadataAssociations
    PublicationReferences
  )
  DESCRIPTIVE_KEYWORDS_FIELDS = %w(
    ISOTopicCategories
    ScienceKeywords
    AncillaryKeywords
    AdditionalAttributes
  )
  DISTRIBUTION_INFORMATION_FIELDS = %w(
    RelatedUrls
    Distributions
  )
  METADATA_INFORMATION_FIELDS = %w(
    MetadataLanguage
    MetadataDates
  )
  ORGANIZATIONS_FIELDS = %w(
    Organizations
  )
  PERSONNEL_FIELDS = %w(
    Personnel
  )
  SPATIAL_INFORMATION_FIELDS = %w(
    SpatialExtent
    TilingIdentificationSystem
    SpatialInformation
    SpatialKeywords
  )
  TEMPORAL_INFORMATION_FIELDS = %w(
    TemporalExtents
    TemporalKeywords
    PaleoTemporalCoverage
  )

  def get_page(field_name)
    if ACQUISITION_INFORMATION_FIELDS.include? field_name
      'acquisition_information'
    elsif COLLECTION_INFORMATION_FIELDS.include? field_name
      'collection_information'
    elsif COLLECTION_CITATIONS_FIELDS.include? field_name
      'resource_citations'
    elsif DATA_IDENTIFICATION_FIELDS.include? field_name
      'data_identification'
    elsif DESCRIPTIVE_KEYWORDS_FIELDS.include? field_name
      'descriptive_keywords'
    elsif DISTRIBUTION_INFORMATION_FIELDS.include? field_name
      'distribution_information'
    elsif METADATA_INFORMATION_FIELDS.include? field_name
      'metadata_information'
    elsif ORGANIZATIONS_FIELDS.include? field_name
      'organizations'
    elsif PERSONNEL_FIELDS.include? field_name
      'personnel'
    elsif SPATIAL_INFORMATION_FIELDS.include? field_name
      'spatial_information'
    elsif TEMPORAL_INFORMATION_FIELDS.include? field_name
      'temporal_information'
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
end
