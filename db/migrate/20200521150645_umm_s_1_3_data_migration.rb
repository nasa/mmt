class UmmS13DataMigration < ActiveRecord::Migration[5.2]
  # This migration has data loss, cannot completely revert to 1.2.
  def up
    drafts = ServiceDraft.where.not(draft: {})

    drafts.each do |draft|
      begin
        metadata = draft.draft
        metadata = make_url_for_1_3(metadata)
        metadata = adjust_use_contraints_for_1_3(metadata)
        metadata = move_contacts_from_organizations(metadata)
        metadata = create_online_resource(metadata)
        draft.draft = adjust_crs_identifier_for_1_3(metadata)
      rescue TypeError
        Rails.logger.error("Data for draft #{draft.id} was not properly formatted and could not be migrated: #{draft.draft}")
      end

      draft.draft.delete('Platforms')
      draft.draft.delete('ScienceKeywords')

      draft.save
    end
  end

  def down
    drafts = ServiceDraft.where.not(draft: {})

    drafts.each do |draft|
      metadata = draft.draft
      metadata = make_related_urls_for_1_2(metadata)
      metadata = adjust_use_contraints_for_1_2(metadata)
      metadata = create_contact_information_from_online_resource(metadata)
      metadata = adjust_crs_identifier_for_1_2(metadata)
      metadata = validate_operation_name(metadata)
      metadata = validate_projection_authority(metadata)
      metadata = remove_zarr_from_formats_for_1_2(metadata)
      metadata = remove_supported_reformattings(metadata)
      draft.draft = adjust_service_type_for_1_2(metadata)

      draft.draft.delete('VersionDescription')
      draft.draft.delete('LastUpdatedDate')

      draft.save
    end
  end

  def make_url_for_1_3(draft)
    related_urls = draft.delete('RelatedURLs') || []
    related_urls = related_urls.select { |related_url| related_url['URLContentType'] == 'DistributionURL' }
    return draft if related_urls.blank?

    draft['URL'] = {
      'Description' => related_urls.first['Description'],
      'URLContentType' => related_urls.first['URLContentType'],
      'Type' => related_urls.first['Type'],
      'Subtype' => related_urls.first['Subtype'],
      'URLValue' => related_urls.first['URL']
    }
    draft
  end

  # Only one URL is retained, so this is not a complete reversion
  def make_related_urls_for_1_2(draft)
    return draft unless (url = draft.delete('URL'))

    draft['RelatedURLs'] = [{
      'Description' => url['Description'],
      'URLContentType' => url['URLContentType'],
      'Type' => url['Type'],
      'Subtype' => url['Subtype'],
      'URL' => url['URLValue']
    }]
    draft
  end

  def adjust_use_contraints_for_1_3(draft)
    return draft unless draft['UseConstraints']

    draft['UseConstraints'] = { 'LicenseText' => draft['UseConstraints'] }
    draft
  end

  def adjust_use_contraints_for_1_2(draft)
    return draft unless draft['UseConstraints']

    draft['UseConstraints'] = draft['UseConstraints']['LicenseText'] || draft['UseConstraints']['LicenseUrl']
    draft
  end

  # Cannot undo this going back to 1.2.
  def move_contacts_from_organizations(draft)
    return draft unless draft['ServiceOrganizations']

    nested_contact_groups = draft['ServiceOrganizations'].select { |organization| organization['ContactGroups'] }.map { |organization| organization.delete('ContactGroups') }.flatten
    nested_contact_persons = draft['ServiceOrganizations'].select { |organization| organization['ContactPersons'] }.map { |organization| organization.delete('ContactPersons') }.flatten
    return draft unless nested_contact_groups.present? || nested_contact_persons.present?

    draft['ContactGroups'] = draft.fetch('ContactGroups', []) + nested_contact_groups
    draft['ContactPersons'] = draft.fetch('ContactPersons', []) + nested_contact_persons
    draft
  end

  def create_online_resource(draft)
    return draft unless draft['ServiceOrganizations']

    draft['ServiceOrganizations'].each do |organization|
      next unless organization['ContactInformation'] && organization['ContactInformation'].is_a?(Hash)

      related_urls = organization.delete('ContactInformation').fetch('RelatedUrls', [])&.select { |url| url['URLContentType'] == 'DataCenterURL' }
      next unless related_urls.present?

      online_resource = {
        'Description' => related_urls.first['Description'],
        'Linkage' => related_urls.first['URL'],
        'Name' => 'HOME PAGE'
      }

      organization['OnlineResource'] = online_resource
    end
    draft
  end

  def create_contact_information_from_online_resource(draft)
    return draft unless draft['ServiceOrganizations']

    draft['ServiceOrganizations'].each do |organization|
      next unless (online_resource = organization.delete('OnlineResource'))

      organization['ContactInformation'] = {
        'RelatedUrls' => [{
          'Description' => online_resource['Description'],
          'URLContentType' => 'DataCenterURL',
          'Type' => 'HOME PAGE',
          'URL' => online_resource['Linkage']
        }]
      }
    end
    draft
  end

  def adjust_crs_identifier_for_1_3(draft)
    return draft unless draft.fetch('OperationMetadata', nil)

    draft['OperationMetadata'].each do |operation_metadata|
      next unless operation_metadata.fetch('CoupledResource', {}).fetch('DataResource', {}).fetch('DataResourceSpatialExtent', nil)

      if operation_metadata['CoupledResource']['DataResource']['DataResourceSpatialExtent']['GeneralGrid'] && (crs_identifier = operation_metadata['CoupledResource']['DataResource']['DataResourceSpatialExtent']['GeneralGrid']['CRSIdentifier'])
        operation_metadata['CoupledResource']['DataResource']['DataResourceSpatialExtent']['GeneralGrid']['CRSIdentifier'] = "EPSG:#{crs_identifier}"
      elsif operation_metadata['CoupledResource']['DataResource']['DataResourceSpatialExtent']['SpatialBoundingBox'] && (crs_identifier = operation_metadata['CoupledResource']['DataResource']['DataResourceSpatialExtent']['SpatialBoundingBox']['CRSIdentifier'])
        operation_metadata['CoupledResource']['DataResource']['DataResourceSpatialExtent']['SpatialBoundingBox']['CRSIdentifier'] = "EPSG:#{crs_identifier}"
      end
    end
    draft
  end

  def adjust_crs_identifier_for_1_2(draft)
    return draft unless draft.fetch('OperationMetadata', nil)

    draft['OperationMetadata'].each do |operation_metadata|
      next unless operation_metadata.fetch('CoupledResource', {}).fetch('DataResource', {}).fetch('DataResourceSpatialExtent', nil)

      if operation_metadata['CoupledResource']['DataResource']['DataResourceSpatialExtent']['GeneralGrid'] && (crs_identifier = operation_metadata['CoupledResource']['DataResource']['DataResourceSpatialExtent']['GeneralGrid']['CRSIdentifier'])
        operation_metadata['CoupledResource']['DataResource']['DataResourceSpatialExtent']['GeneralGrid']['CRSIdentifier'] = crs_identifier.include?('EPSG:') ? crs_identifier.gsub('EPSG:', '') : nil
      elsif operation_metadata['CoupledResource']['DataResource']['DataResourceSpatialExtent']['SpatialBoundingBox'] && (crs_identifier = operation_metadata['CoupledResource']['DataResource']['DataResourceSpatialExtent']['SpatialBoundingBox']['CRSIdentifier'])
        operation_metadata['CoupledResource']['DataResource']['DataResourceSpatialExtent']['SpatialBoundingBox']['CRSIdentifier'] = crs_identifier.include?('EPSG:') ? crs_identifier.gsub('EPSG:', '') : nil
      end
    end
    draft
  end

  def adjust_service_type_for_1_2(draft)
    draft['Type'] = 'WEB SERVICES' if draft['Type'] == 'EGI - No Processing'
    draft['Type'] = 'WMS' if draft['Type'] == 'WMTS'
    draft
  end

  def remove_zarr_from_formats_for_1_2(draft)
    return draft unless draft['ServiceOptions'] && (draft['ServiceOptions']['SupportedInputFormats'] || draft['ServiceOptions']['SupportedOutputFormats'])

    draft['ServiceOptions']['SupportedInputFormats'].delete('ZARR')
    draft['ServiceOptions']['SupportedOutputFormats'].delete('ZARR')
    draft
  end

  def validate_projection_authority(draft)
    crs_identifier = ["4326", "3395", "3785", "9807", "2000.63", "2163", "3408", "3410", "6931",
     "6933", "3411", "9822", "54003", "54004", "54008", "54009", "26917", "900913"].freeze

    if draft['ServiceOptions'] && draft['ServiceOptions']['SupportedInputProjections']
      draft['ServiceOptions']['SupportedInputProjections'].each do |projection|
        projection.delete('ProjectionAuthority') unless crs_identifier.include?(projection['ProjectionAuthority'])
      end
    end

    if draft['ServiceOptions'] && draft['ServiceOptions']['SupportedOutputProjections']
      draft['ServiceOptions']['SupportedOutputProjections'].each do |projection|
        projection.delete('ProjectionAuthority') unless crs_identifier.include?(projection['ProjectionAuthority'])
      end
    end

    draft
  end

  def validate_operation_name(draft)
    return draft unless draft['OperationMetadata']

    draft['OperationMetadata'].each do |metadata|
      metadata.delete('OperationName') if metadata['OperationName'] == 'GetTile'
    end
    draft
  end

  def remove_supported_reformattings(draft)
    return draft unless draft['ServiceOptions']

    draft['ServiceOptions'].delete('SupportedReformattings')
    draft
  end
end
