class UmmC110To112 < ActiveRecord::Migration
  def up
    CollectionDraft.find_each do |d|
      draft = d.draft
      # Update RelatedUrlTypeEnum and RelatedUrlSubTypeEnum
      if draft.key? 'RelatedUrls' # array
        Array.wrap(draft['RelatedUrls']).each do |related_url|
          if related_url.key?('URLContentType')
            update_type_subtype(related_url)
          end
        end
      end
      d.draft = draft
      d.save
    end
  end

  def update_type_subtype(related_url)
    url_content_type = related_url['URLContentType']
    case url_content_type
    when 'CollectionURL'
      update_collection_url(related_url)
    when 'DistributionURL'
      update_distribution_url(related_url)
    when 'PublicationURL'
      update_publication_url(related_url)
    when 'VisualizationURL'
      update_visualization_url(related_url)
    end
  end

  def update_collection_url(related_url)
    if related_url['Type'] == 'DOI'
      related_url['Type'] = 'DATA SET LANDING PAGE'
    end
  end

  def update_distribution_url(related_url)
    if related_url['Type'] == 'GET DATA'
      if related_url['Subtype'] == 'EARTHDATA SEARCH'
        related_url['Subtype'] = 'Earthdata Search'
      end
      if related_url['Subtype'] == 'ECHO'
        related_url['Subtype'] = 'Earthdata Search'
      end
      if related_url['Subtype'] == 'EDG'
        related_url['Subtype'] = 'Earthdata Search'
      end
      if related_url['Subtype'] == 'GDS'
        related_url['Type'] = 'USE SERVICE API'
        related_url['Subtype'] = 'GRADS DATA SERVER (GDS)'
      end
      if related_url['Subtype'] == 'KML'
        related_url.delete('Subtype')
      end
      if related_url['Subtype'] == 'LAS'
        related_url['Type'] = 'GOTO WEB TOOL'
        related_url['Subtype'] = 'LIVE ACCESS SERVER (LAS)'
      end
      if related_url['Subtype'] == 'ON-LINE ARCHIVE'
        related_url['Subtype'] = 'DATA TREE'
      end
      if related_url['Subtype'] == 'REVERB'
        related_url['Subtype'] = 'Earthdata Search'
      end
    end

    if related_url['Type'] == 'GET SERVICE' && !related_url.key?('Subtype')
      related_url['Type'] = 'USE SERVICE API'
    end

    if related_url['Type'] == 'GET SERVICE'
      if related_url['Subtype'] == 'ACCESS MAP VIEWER'
        related_url['Type'] = 'GOTO WEB TOOL'
        related_url['Subtype'] = 'MAP VIEWER'
      end
      if related_url['Subtype'] == 'ACCESS MOBILE APP'
        related_url['Type'] = 'DOWNLOAD SOFTWARE'
        related_url['Subtype'] = 'MOBILE APP'
      end
      if related_url['Subtype'] == 'ACCESS WEB SERVICE'
        related_url['Type'] = 'USE SERVICE API'
        related_url.delete('Subtype')
      end
      if related_url['Subtype'] == 'DIF'
        related_url['URLContentType'] = 'CollectionURL'
        related_url['Type'] = 'EXTENDED METADATA'
        related_url.delete('Subtype')
      end
      if related_url['Subtype'] == 'MAP SERVICE'
        related_url['Type'] = 'USE SERVICE API'
      end
      if related_url['Subtype'] == 'NOMADS'
        related_url['Type'] = 'GET DATA'
      end
      if related_url['Subtype'] == 'OPENDAP DATA'
        related_url['Type'] = 'USE SERVICE API'
      end
      if related_url['Subtype'] == 'OPENDAP DATA (DODS)'
        related_url['Type'] = 'USE SERVICE API'
        related_url['Subtype'] = 'OPENDAP DATA'
      end
      if related_url['Subtype'] == 'OPENDAP DIRECTORY (DODS)'
        related_url['Type'] = 'USE SERVICE API'
        related_url['Subtype'] = 'OPENDAP DATA'
      end
      if related_url['Subtype'] == 'OpenSearch'
        related_url['Type'] = 'USE SERVICE API'
      end
      if related_url['Subtype'] == 'SERF'
        related_url['URLContentType'] = 'CollectionURL'
        related_url['Type'] = 'EXTENDED METADATA'
        related_url.delete('Subtype')
      end
      if related_url['Subtype'] == 'SOFTWARE PACKAGE'
        related_url['Type'] = 'DOWNLOAD SOFTWARE'
        related_url.delete('Subtype')
      end
      if related_url['Subtype'] == 'SSW'
        related_url['Type'] = 'GOTO WEB TOOL'
        related_url['Subtype'] = 'SIMPLE SUBSET WIZARD (SSW)'
      end
      if related_url['Subtype'] == 'SUBSETTER'
        related_url['Type'] = 'GOTO WEB TOOL'
      end
      if related_url['Subtype'] == 'THREDDS CATALOG'
        related_url['Type'] = 'USE SERVICE API'
        related_url['Subtype'] = 'THREDDS DATA'
      end
      if related_url['Subtype'] == 'THREDDS DATA'
        related_url['Type'] = 'USE SERVICE API'
      end
      if related_url['Subtype'] == 'THREDDS DIRECTORY'
        related_url['Type'] = 'USE SERVICE API'
        related_url['Subtype'] = 'THREDDS DATA'
      end
      if related_url['Subtype'] == 'WEB COVERAGE SERVICE (WCS)'
        related_url['Type'] = 'USE SERVICE API'
      end
      if related_url['Subtype'] == 'WEB FEATURE SERVICE (WFS)'
        related_url['Type'] = 'USE SERVICE API'
      end
      if related_url['Subtype'] == 'WEB MAP FOR TIME SERIES'
        related_url['Type'] = 'USE SERVICE API'
        related_url['Subtype'] = 'WEB MAP SERVICE (WMS)'
      end
      if related_url['Subtype'] == 'WEB MAP SERVICE (WMS)'
        related_url['Type'] = 'USE SERVICE API'
      end
      if related_url['Subtype'] == 'WORKFLOW (SERVICE CHAIN)'
        related_url['Type'] = 'USE SERVICE API'
        related_url['Subtype'] = 'Service Chaining'
      end
    end
  end

  def update_publication_url(related_url)
    if related_url['Type'] == 'VIEW RELATED INFORMATION'
      if related_url['Subtype'] == 'ALGORITHM THEORETICAL BASIS DOCUMENT'
        related_url['Subtype'] = 'ALGORITHM THEORETICAL BASIS DOCUMENT (ATBD)'
      end
      if related_url['Subtype'] == 'DATA USAGE'
        related_url['Subtype'] = 'GENERAL DOCUMENTATION'
      end
      if related_url['Subtype'] == 'PRODUCTION VERSION HISTORY'
        related_url['Subtype'] = 'PRODUCTION HISTORY'
      end
      if related_url['Subtype'] == 'RADIOMETRIC AND GEOMETRIC CALIBRATION METHODS'
        related_url['Subtype'] = 'INSTRUMENT/SENSOR CALIBRATION DOCUMENTATION'
      end
      if related_url['Subtype'] == 'RECIPE'
        related_url['Subtype'] = 'DATA RECIPE'
      end
      if related_url['Subtype'] == 'USER FEEDBACK'
        related_url['Subtype'] = 'USER FEEDBACK PAGE'
      end
    end
  end

  def update_visualization_url(related_url)
    if related_url['Type'] == 'GET RELATED VISUALIZATION'
      if related_url['Subtype'] == 'GIBS'
        related_url['Subtype'] = 'WORLDVIEW'
      end
    end
  end
end
