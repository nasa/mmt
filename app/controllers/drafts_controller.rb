class DraftsController < ApplicationController
  before_action :set_draft, only: [:show, :edit, :update, :destroy, :publish]
  before_action :load_umm_schema

  # GET /drafts
  # GET /drafts.json
  def index
    @drafts = @current_user.drafts.order('updated_at DESC')
  end

  # GET /drafts/1
  # GET /drafts/1.json
  def show
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
    draft = @draft.draft
    # These fields currently break in CMR when trying to ingest
    draft.delete('Distributions')

    translated_metadata, _errors = translate_metadata(draft)

    if translated_metadata && !translated_metadata.include?('errors')
      ingested = cmr_client.ingest_collection(translated_metadata, @current_user.provider_id, @draft.native_id, token)

      if ingested.success?
        xml = MultiXml.parse(ingested.body)
        concept_id = xml['result']['concept_id']
        revision_id = xml['result']['revision_id']
        flash[:success] = 'Draft was successfully published'
        redirect_to collection_path(concept_id, revision_id: revision_id)
      else
        # Log error message
        Rails.logger.error("Ingest Metadata Error: #{ingested.inspect}")

        @errors = [{
          page: nil,
          field: nil,
          error: 'An unknown error caused publishing to fail.'
        }]
        flash[:error] = 'Draft was not published successfully'
        render :show
      end
    else
      # log translated error message
      Rails.logger.error("Translated Metadata Error: #{translated_metadata.inspect}")
      flash[:error] = 'Draft was not published successfully'
      render :show
    end
  end

  def download_xml
    draft = Draft.find(params[:draft_id])
    xml_format = params[:format]
    xml_format = 'iso:smap' if xml_format == 'iso_smap'
    metadata = cmr_client.translate_collection(draft.draft.to_json, 'application/umm+json', "application/#{xml_format}+xml", true).body

    respond_to do |format|
      format.dif10 { render xml: metadata }
      format.dif { render xml: metadata }
      format.echo10 { render xml: metadata }
      format.iso19115 { render xml: metadata }
      format.iso_smap { render xml: metadata }
    end
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
    params.require(:draft).permit(:user_id, :draft, :title)
  end

  def load_umm_schema
    @json_schema = JSON.parse(File.read(File.join(Rails.root, 'lib', 'assets', 'schemas', 'umm-c-merged.json')))
  end

  def translate_metadata(draft)
    translated_response = cmr_client.translate_collection(draft.to_json, 'application/umm+json', 'application/iso19115+xml').body

    xml = MultiXml.parse(translated_response)
    errors = nil
    if xml['errors']
      Rails.logger.error("Translated Metadata Response: #{translated_response.inspect}")
      errors = Array.wrap(xml['errors']['error'])
    end
    value = errors.nil? ? translated_response : nil
    [value, errors]
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
  DATA_IDENTIFICATION_FIELDS = %w(
    EntryId
    Version
    EntryTitle
    Abstract
    Purpose
    DataLanguage
    DataDates
    Organizations
    Personnel
    CollectionDataType
    ProcessingLevel
    CollectionCitations
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
    elsif DATA_IDENTIFICATION_FIELDS.include? field_name
      'data_identification'
    elsif DESCRIPTIVE_KEYWORDS_FIELDS.include? field_name
      'descriptive_keywords'
    elsif DISTRIBUTION_INFORMATION_FIELDS.include? field_name
      'distribution_information'
    elsif METADATA_INFORMATION_FIELDS.include? field_name
      'metadata_information'
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
    end
  end
end
