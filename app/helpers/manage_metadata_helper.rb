# :nodoc:
module ManageMetadataHelper
  URI_REGEX = %r{^(?:[A-Za-z][A-Za-z0-9+\-.]*:(?:\/\/(?:(?:[A-Za-z0-9\-._~!$&'()*+,;=:]|%[0-9A-Fa-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9A-Fa-f]{1,4}:){6}|::(?:[0-9A-Fa-f]{1,4}:){5}|(?:[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,1}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){3}|(?:(?:[0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){2}|(?:(?:[0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}:|(?:(?:[0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})?::)(?:[0-9A-Fa-f]{1,4}:[0-9A-Fa-f]{1,4}|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))|(?:(?:[0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})?::)|[Vv][0-9A-Fa-f]+\.[A-Za-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(?:[A-Za-z0-9\-._~!$&'()*+,;=]|%[0-9A-Fa-f]{2})*)(?::[0-9]*)?(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*|\/(?:(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)?|(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*|)(?:\?(?:[A-Za-z0-9\-._~!$&'()*+,;=:@\/?]|%[0-9A-Fa-f]{2})*)?(?:\#(?:[A-Za-z0-9\-._~!$&'()*+,;=:@\/?]|%[0-9A-Fa-f]{2})*)?|(?:\/\/(?:(?:[A-Za-z0-9\-._~!$&'()*+,;=:]|%[0-9A-Fa-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9A-Fa-f]{1,4}:){6}|::(?:[0-9A-Fa-f]{1,4}:){5}|(?:[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,1}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){3}|(?:(?:[0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){2}|(?:(?:[0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}:|(?:(?:[0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})?::)(?:[0-9A-Fa-f]{1,4}:[0-9A-Fa-f]{1,4}|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))|(?:(?:[0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})?::)|[Vv][0-9A-Fa-f]+\.[A-Za-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(?:[A-Za-z0-9\-._~!$&'()*+,;=]|%[0-9A-Fa-f]{2})*)(?::[0-9]*)?(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*|\/(?:(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)?|(?:[A-Za-z0-9\-._~!$&'()*+,;=@]|%[0-9A-Fa-f]{2})+(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*|)(?:\?(?:[A-Za-z0-9\-._~!$&'()*+,;=:@\/?]|%[0-9A-Fa-f]{2})*)?(?:\#(?:[A-Za-z0-9\-._~!$&'()*+,;=:@\/?]|%[0-9A-Fa-f]{2})*)?)$}

  DATE_TIME_REGEX = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d{2,3}([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/

  ACQUISITION_INFORMATION_FIELDS = %w(
    Platforms
    Projects
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

  def breadcrumb_name(metadata, type)
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

  def current_manage_title
    if controller.lookup_context.prefixes.include?('search')
      "manage_#{resource_type}"
    elsif controller.lookup_context.prefixes.include?('manage_cmr')
      'manage_cmr'
    elsif controller.lookup_context.prefixes.include?('manage_variables') || controller.lookup_context.prefixes.include?('variable_drafts') || (controller.lookup_context.prefixes.include?('collection_associations') && params[:variable_id])
      'manage_variables'
    elsif controller.lookup_context.prefixes.include?('manage_services') || controller.lookup_context.prefixes.include?('service_drafts') || (controller.lookup_context.prefixes.include?('collection_associations') && params[:service_id])
      'manage_services'
    else
      # default, including collection drafts and everything under manage collections
      'manage_collections'
    end
  end

  # resource type for the Search button text based on the controller
  def resource_type
    case
    when controller_name.starts_with?('search')
      params[:record_type]
    when controller_name.include?('variable') || controller.lookup_context.prefixes.include?('manage_variables') || controller.lookup_context.prefixes.include?('collection_associations')
      'variables'
    when controller_name.include?('service') || controller.lookup_context.prefixes.include?('manage_services')
      'services'
    else
      # default
      'collections'
    end
  end

  def display_header_subtitle(metadata, type)
    return unless type.downcase.include?('variable') || type.downcase.include?('service')

    metadata['LongName'] || 'Long Name Not Provided'
  end

  def edsc_map_path
    service_configs = Rails.configuration.services
    edsc_root = service_configs['earthdata'][Rails.configuration.cmr_env]['edsc_root']
    "#{edsc_root}/search/map"
  end
end
