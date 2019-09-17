# :nodoc:
class ManageMetadataController < ApplicationController

  protected

  def fetch_entry_id(metadata, type)
    short_name = if type.downcase.include? 'collection'
                   metadata['ShortName'] || '<Blank Short Name>'
                 elsif type.downcase.include? 'variable'
                   metadata['Name'] || '<Blank Name>'
                 elsif type.downcase.include? 'service'
                   metadata['Name'] || '<Blank Name>'
                 end

    version = metadata.fetch('Version', '')
    version = "_#{version}" unless version.empty?

    short_name + version
  end
  helper_method :fetch_entry_id

  # helper methods used by published record controller methods ensuring a user
  # has the appropriate provider context set
  def set_record_action
    @record_action =  case
                      when request.original_url.include?('edit')
                        'edit'
                      when request.original_url.include?('delete')
                        'delete'
                      when request.original_url.include?('clone')
                        'clone'
                      when request.original_url.include?('revert')
                        'revert'
                      end
  end

  def set_user_permissions
    @user_permissions = if available_provider?(@provider_id)
                          'wrong_provider'
                        else
                          'none'
                        end
  end

  def parse_umm_version_number(umm_version_string)
    umm_version_string.split('version=').last.split(';').first.to_f
  end

  def get_latest_record_version(concept_id)
    latest_record_response = cmr_client.get_concept(concept_id, token, {})

    if latest_record_response.error?
      Rails.logger.error("Error retrieving concept for #{published_resource_name} #{concept_id} in `get_latest_record_version`: #{latest_record_response.clean_inspect}")

      @unconfirmed_version = true
    else
      parse_umm_version_number(latest_record_response.headers['content-type'])
    end
  end

  def compare_resource_umm_version(concept_id = nil)
    resource_id = "#{published_resource_name}_id".to_sym

    concept_id ||= (params[resource_id] || params[:id])

    record_version = get_latest_record_version(concept_id)
    return if @unconfirmed_version

    config_resource_version = case published_resource_name
                              when 'service'
                                'umm_s_version'
                              when 'variable'
                                'umm_var_version'
                              end
    mmt_resource_version = parse_umm_version_number(Rails.configuration.send(config_resource_version))

    @unsupported_version = true if record_version > mmt_resource_version
  end

  def set_variable
    @concept_id = params[:variable_id] || params[:id]
    @revision_id = params[:revision_id]

    # retrieve the variable metadata with the current umm_var version
    headers = { 'Accept' => "application/#{Rails.configuration.umm_var_version}; charset=utf-8" }
    variable_concept_response = cmr_client.get_concept(@concept_id, token, headers, @revision_id)

    @variable = if variable_concept_response.success?
                  variable_concept_response.body
                else
                  Rails.logger.error("Error retrieving concept for Variable #{@concept_id} in `set_variable`: #{variable_concept_response.clean_inspect}")
                  {}
                end

    set_variable_information
  end

  def set_variable_information
    # search for variable by concept id to get the native_id and provider_id
    # if the variable is not found, try again because CMR might be a little slow to index if it is a newly published record
    attempts = 0
    while attempts < 20
      variables_search_response = cmr_client.get_variables(concept_id: @concept_id, all_revisions: true)

      variable_data = if variables_search_response.success?
                        variables_search_response.body.fetch('items', [])
                      else
                        []
                      end
      variable_data.sort! { |a, b| b['meta']['revision-id'] <=> a['meta']['revision-id'] }

      @revisions = variable_data
      latest = variable_data.first
      meta = latest.nil? ? {} : latest.fetch('meta', {})

      @old_revision = !@revision_id.nil? && meta['revision-id'].to_s != @revision_id.to_s ? true : false

      break if latest && !@revision_id
      break if latest && meta.fetch('revision-id', 0) >= @revision_id.to_i && meta['concept-id'] == @concept_id
      attempts += 1
      sleep 0.05
    end

    if latest.blank?
      Rails.logger.error("Error searching for Variable #{@concept_id} in `set_variable_information`: #{variables_search_response.clean_inspect}")
    else
      @provider_id = meta['provider-id']
      @native_id = meta['native-id']
      @num_associated_collections = cmr_client.get_collections_by_post({ variable_concept_id: @concept_id }, token).body.fetch('items', []).size
    end
  end

  def set_service
    @concept_id = params[:service_id] || params[:id]
    @revision_id = params[:revision_id]

    # retrieve the variable metadata with the current umm_var version
    headers = { 'Accept' => "application/#{Rails.configuration.umm_s_version}; charset=utf-8" }
    service_concept_response = cmr_client.get_concept(@concept_id, token, headers, @revision_id)

    @service = if service_concept_response.success?
                 service_concept_response.body
               else
                 Rails.logger.error("Error retrieving concept for Service #{@concept_id} in `set_service`: #{service_concept_response.clean_inspect}")
                 {}
               end

    set_service_information
  end

  def set_service_information
    # search for service by concept id to get the native_id and provider_id
    # if the service is not found, try again because CMR might be a little slow to index if it is a newly published record
    attempts = 0
    while attempts < 20
      services_search_response = cmr_client.get_services(concept_id: @concept_id, all_revisions: true)

      service_data = if services_search_response.success?
                       services_search_response.body.fetch('items', [])
                     else
                       []
                     end
      service_data.sort! { |a, b| b['meta']['revision-id'] <=> a['meta']['revision-id'] }

      @revisions = service_data
      latest = service_data.first
      meta = latest.nil? ? {} : latest.fetch('meta', {})

      @old_revision = !@revision_id.nil? && meta['revision-id'].to_s != @revision_id.to_s ? true : false

      break if latest && !@revision_id
      break if latest && meta.fetch('revision-id', 0) >= @revision_id.to_i && meta['concept-id'] == @concept_id
      attempts += 1
      sleep 0.05
    end

    if latest.blank?
      Rails.logger.error("Error searching for Service #{@concept_id} in `set_service_information`: #{services_search_response.clean_inspect}")
    else
      @provider_id = meta['provider-id']
      @native_id = meta['native-id']
      @num_associated_collections = cmr_client.get_collections_by_post({ service_concept_id: @concept_id }, token).body.fetch('items', []).size
    end
  end

  def generate_ingest_errors(response)
    errors = response.errors
    request_id = response.cmr_request_header

    if errors.empty?
      [{
        page: nil,
        field: nil,
        error: 'An unknown error caused publishing to fail.',
        request_id: request_id
      }]
    else
      errors.map do |error|
        path = error['path'].nil? ? [nil] : Array.wrap(error['path'])
        error = error['errors'].nil? ? error : error['errors'].first

        # only show the feedback module link if the error is 500
        request_id = nil unless response.status == 500
        {
          field: path.last,
          top_field: path.first,
          page: get_page(path),
          error: error,
          request_id: request_id
        }
      end
    end
  end

  def get_page(fields)
    # for path in generate_ingest_errors
    return nil if fields.nil?
    # for field in generate_show_errors
    if ACQUISITION_INFORMATION_FIELDS.include? fields.first
      'acquisition_information'
    elsif COLLECTION_INFORMATION_FIELDS.include? fields.first
      'collection_information'
    elsif COLLECTION_CITATIONS_FIELDS.include? fields.first
      'collection_citations'
    elsif DATA_IDENTIFICATION_FIELDS.include? fields.first
      'data_identification'
    elsif DESCRIPTIVE_KEYWORDS_FIELDS.include? fields.first
      'descriptive_keywords'
    elsif RELATED_URL_FIELDS.include? fields.first
      'related_urls'
    elsif METADATA_INFORMATION_FIELDS.include? fields.first
      'metadata_information'
    elsif fields.include?('ContactPersons' || 'ContactGroups') # DATA_CONTACTS
      'data_contacts'
    elsif DATA_CENTERS_FIELDS.include? fields.first
      'data_centers'
    elsif SPATIAL_INFORMATION_FIELDS.include? fields.first
      'spatial_information'
    elsif TEMPORAL_INFORMATION_FIELDS.include? fields.first
      'temporal_information'
    elsif ARCHIVE_AND_DISTRIBUTION_INFORMATION_FIELDS.include? fields.first
      'archive_and_distribution_information'
    end
  end

  private

  DATE_TIME_REGEX = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d{2,3}([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/

  URI_REGEX = %r{^(?:[A-Za-z][A-Za-z0-9+\-.]*:(?:\/\/(?:(?:[A-Za-z0-9\-._~!$&'()*+,;=:]|%[0-9A-Fa-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9A-Fa-f]{1,4}:){6}|::(?:[0-9A-Fa-f]{1,4}:){5}|(?:[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,1}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){3}|(?:(?:[0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){2}|(?:(?:[0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}:|(?:(?:[0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})?::)(?:[0-9A-Fa-f]{1,4}:[0-9A-Fa-f]{1,4}|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))|(?:(?:[0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})?::)|[Vv][0-9A-Fa-f]+\.[A-Za-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(?:[A-Za-z0-9\-._~!$&'()*+,;=]|%[0-9A-Fa-f]{2})*)(?::[0-9]*)?(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*|\/(?:(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)?|(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*|)(?:\?(?:[A-Za-z0-9\-._~!$&'()*+,;=:@\/?]|%[0-9A-Fa-f]{2})*)?(?:\#(?:[A-Za-z0-9\-._~!$&'()*+,;=:@\/?]|%[0-9A-Fa-f]{2})*)?|(?:\/\/(?:(?:[A-Za-z0-9\-._~!$&'()*+,;=:]|%[0-9A-Fa-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9A-Fa-f]{1,4}:){6}|::(?:[0-9A-Fa-f]{1,4}:){5}|(?:[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,1}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){3}|(?:(?:[0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){2}|(?:(?:[0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}:|(?:(?:[0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})?::)(?:[0-9A-Fa-f]{1,4}:[0-9A-Fa-f]{1,4}|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))|(?:(?:[0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})?::)|[Vv][0-9A-Fa-f]+\.[A-Za-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(?:[A-Za-z0-9\-._~!$&'()*+,;=]|%[0-9A-Fa-f]{2})*)(?::[0-9]*)?(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*|\/(?:(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)?|(?:[A-Za-z0-9\-._~!$&'()*+,;=@]|%[0-9A-Fa-f]{2})+(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*|)(?:\?(?:[A-Za-z0-9\-._~!$&'()*+,;=:@\/?]|%[0-9A-Fa-f]{2})*)?(?:\#(?:[A-Za-z0-9\-._~!$&'()*+,;=:@\/?]|%[0-9A-Fa-f]{2})*)?)$}

  ACQUISITION_INFORMATION_FIELDS = %w(
    Platforms
    Projects
  )
  ARCHIVE_AND_DISTRIBUTION_INFORMATION_FIELDS = %w(
    FileArchiveInformation
    FileDistributionInformation
  )
  COLLECTION_INFORMATION_FIELDS = %w(
    ShortName
    Version
    VersionDescription
    EntryTitle
    Abstract
    Purpose
    DataLanguage
  )
  COLLECTION_CITATIONS_FIELDS = %w(
    CollectionCitations
    DOI
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
  RELATED_URL_FIELDS = %w(
    RelatedUrls
  )
  METADATA_INFORMATION_FIELDS = %w(
    MetadataLanguage
    MetadataDates
  )
  DATA_CENTERS_FIELDS = %w(
    DataCenters
  )
  DATA_CONTACTS_FIELDS = %w(
    DataContacts
  )
  SPATIAL_INFORMATION_FIELDS = %w(
    SpatialExtent
    TilingIdentificationSystem
    SpatialInformation
    LocationKeywords
  )
  TEMPORAL_INFORMATION_FIELDS = %w(
    TemporalExtents
    TemporalKeywords
    PaleoTemporalCoverages
  )

  def ensure_non_nasa_draft_user
    unless is_non_nasa_draft_user?(user: current_user, token: token)
      clear_session_and_token_data

      redirect_to root_url, flash: { error: "It appears you are not provisioned with the proper permissions to access the MMT for Non-NASA Users. Please try again or contact #{view_context.mail_to('support@earthdata.nasa.gov', 'Earthdata Support')}." }
    end
  end
end
