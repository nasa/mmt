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
    _response, @errors = translate_metadata(@draft.draft)
  end

  # GET /drafts/new
  def new
    draft = Draft.create(user: @current_user, draft: {})
    redirect_to draft_path(draft)
  end

  # GET /drafts/1/edit
  def edit
    if params[:form]
      @draft_form = params[:form]
      @science_keywords = cmr_client.get_science_keywords if params[:form] == 'descriptive_keywords'
    else
      render action: 'show'
    end
  end

  # PATCH/PUT /drafts/1
  # PATCH/PUT /drafts/1.json
  def update
    @draft = Draft.find(params[:id])
    if @draft.update_draft(params[:draft])
      case params[:commit]
      when 'Save & Done'
        redirect_to @draft, notice: 'Draft was successfully updated.'
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
      redirect_to @draft
    end
  end

  # DELETE /drafts/1
  # DELETE /drafts/1.json
  def destroy
    @draft.destroy
    respond_to do |format|
      format.html { redirect_to dashboard_url } # Retain this for later use?, notice: "Draft \"#{@draft.entry_id}\"was successfully deleted." }
    end
  end

  def publish
    draft = @draft.draft
    # These fields currently break in CMR when trying to ingest
    draft.delete('Distributions')

    translated_metadata, @errors = translate_metadata(draft)

    if translated_metadata && !translated_metadata.include?('errors')
      ingested = cmr_client.ingest_collection(translated_metadata, @current_user.provider_id, @draft.native_id, token)

      if ingested.success?
        xml = MultiXml.parse(ingested.body)
        concept_id = xml['result']['concept_id']
        revision_id = xml['result']['revision_id']
        redirect_to collection_path(concept_id, revision_id: revision_id)
      else
        # Log error message
        Rails.logger.error("Ingest Metadata Error: #{ingested.inspect}")

        @errors = [{
          page: nil,
          field: nil,
          error: 'An unknown error caused publishing to fail.'
        }]
        render :show
      end
    else
      # log translated error message
      Rails.logger.error("Translated Metadata Error: #{translated_metadata.inspect}")
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
    @draft = Draft.find(id)
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
      errors.map! { |error| generate_errors(error, draft) }.flatten!
    end
    value = errors.nil? ? translated_response : nil
    [value, errors]
  end

  def generate_errors(string, draft)
    fields = string.split(' ')[0]

    if string.include? 'has missing required properties'
      required_fields = string.delete('"').match(/\(\[(.*)\]\)/)[1].split(',')

      # If the error is for top level required fields
      if string.start_with? 'object'
        # if none of the fields from a page are completed, don't display errors for that page
        [
          ACQUISITION_INFORMATION_FIELDS,
          DATA_IDENTIFICATION_FIELDS,
          DESCRIPTIVE_KEYWORDS_FIELDS,
          DISTRIBUTION_INFORMATION_FIELDS,
          METADATA_INFORMATION_FIELDS,
          SPATIAL_EXTENT_FIELDS,
          TEMPORAL_EXTENT_FIELDS
        ].each do |all_fields|
          # Display all missing required fields to make it easier for the user to find problems
          # This code might still be usefule for the dots/checkboxes on the preview page
          # required_fields.delete_if { |field| all_fields.include?(field) } if (all_fields & draft.keys).empty?
        end

        required_fields.map! do |field|
          {
            field: field,
            page: get_page(field),
            error: 'is required'
          }
        end
      # if the error is for nested required fields
      else
        required_fields.map! do |field|
          {
            field: field,
            page: get_page(fields.split('/')[1]),
            error: 'is required'
          }
        end
      end
    # If there error is not about required fields
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
        page: get_page(fields.split('/')[1]),
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
  SPATIAL_EXTENT_FIELDS = %w(
    SpatialExtent
    TilingIdentificationSystem
    SpatialInformation
    SpatialKeywords
  )
  TEMPORAL_EXTENT_FIELDS = %w(
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
    elsif SPATIAL_EXTENT_FIELDS.include? field_name
      'spatial_extent'
    elsif TEMPORAL_EXTENT_FIELDS.include? field_name
      'temporal_extent'
    end
  end

  def get_error(error)
    case error
    when /is too long/
      'is too long'
    when /greater than the required maximum/
      'is too high'
    when /invalid against requested date format/
      'is an invalid date format'
    when /regex/
      'is an invalid format'
    when /is not a valid URI/
      'is an invalid URI'
    end
  end
end
