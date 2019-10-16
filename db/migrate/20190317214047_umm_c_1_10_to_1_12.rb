class UmmC110To112 < ActiveRecord::Migration[4.2]
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

  def down
    CollectionDraft.find_each do |d|
      draft = d.draft
      # Update RelatedUrlTypeEnum and RelatedUrlSubTypeEnum
      if draft.key? 'RelatedUrls' # array
        Array.wrap(draft['RelatedUrls']).each do |related_url|
          if related_url.key?('URLContentType')
            down_update_type_subtype(related_url)
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

  def down_update_type_subtype(related_url)
    url_content_type = related_url['URLContentType']
    case url_content_type
    when 'DistributionURL'
      down_update_distribution_url(related_url)
    when 'PublicationURL'
      down_update_publication_url(related_url)
    when 'VisualizationURL'
      down_update_visualization_url(related_url)
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

  def down_update_distribution_url(related_url)
    if related_url['Type'] == 'DOWNLOAD SOFTWARE' && !related_url.key?('Subtype')
      related_url['Type'] = 'GET SERVICE'
    end
    if related_url['Type'] == 'DOWNLOAD SOFTWARE'
      if related_url['Subtype'] == 'MOBILE APP'
        related_url['Type'] = 'GET SERVICE'
        related_url['Subtype'] = 'ACCESS MOBILE APP'
      end
    end
    if related_url['Type'] == 'GET DATA'
      if related_url['Subtype'] == 'APPEEARS'
        related_url.delete('Subtype')
      end
      if related_url['Subtype'] == 'DATA COLLECTION BUNDLE'
        related_url.delete('Subtype')
      end
      if related_url['Subtype'] == 'DATA TREE'
        related_url['Subtype'] = 'ON-LINE ARCHIVE'
      end
      if related_url['Subtype'] == 'DIRECT DOWNLOAD'
        related_url.delete('Subtype')
      end
      if related_url['Subtype'] == 'Earthdata Search'
        related_url['Subtype'] = 'EARTHDATA SEARCH'
      end
      if related_url['Subtype'] == 'NOMADS'
        related_url['Type'] = 'GET SERVICE'
      end
      if related_url['Subtype'] == 'PORTAL'
        related_url['Subtype'] = 'EARTHDATA SEARCH'
      end
      if related_url['Subtype'] == 'USGS EARTH EXPLORER'
        related_url['Subtype'] = 'EARTHDATA SEARCH'
      end
      if related_url['Subtype'] == 'VERTEX'
        related_url.delete('Subtype')
      end
      if related_url['Subtype'] == 'VIRTUAL COLLECTION'
        related_url['Subtype'] = 'EARTHDATA SEARCH'
      end
      if related_url['Subtype'] == 'GoLIVE Portal'
        related_url.delete('Subtype')
      end
      if related_url['Subtype'] == 'IceBridge Portal'
        related_url.delete('Subtype')
      end
      if related_url['Subtype'] == 'Order'
        related_url.delete('Subtype')
      end
      if related_url['Subtype'] == 'Subscribe'
        related_url.delete('Subtype')
      end
    end

    if related_url['Type'] == 'GOTO WEB TOOL'
      if !related_url.key?('Subtype')
        related_url['Type'] = 'GET DATA'
      end
      if related_url['Subtype'] == 'LIVE ACCESS SERVER (LAS)'
        related_url['Type'] = 'GET DATA'
        related_url['Subtype'] = 'LAS'
      end
      if related_url['Subtype'] == 'MAP VIEWER'
        related_url['Type'] = 'GET SERVICE'
        related_url['Subtype'] = 'ACCESS MAP VIEWER'
      end
      if related_url['Subtype'] == 'SIMPLE SUBSET WIZARD (SSW)'
        related_url['Type'] = 'GET SERVICE'
        related_url['Subtype'] = 'SSW'
      end
      if related_url['Subtype'] == 'SUBSETTER'
        related_url['Type'] = 'GET SERVICE'
      end
    end
    if related_url['Type'] == 'USE SERVICE API'
      if !related_url.key?('Subtype')
        related_url['Type'] = 'GET SERVICE'
      end
      if related_url['Subtype'] == 'GRADS DATA SERVER (GDS)'
        related_url['Type'] = 'GET DATA'
        related_url['Subtype'] = 'GDS'
      end
      if related_url['Subtype'] == 'MAP SERVICE'
        related_url['Type'] = 'GET SERVICE'
      end
      if related_url['Subtype'] == 'OPENDAP DATA'
        related_url['Type'] = 'GET SERVICE'
      end
      if related_url['Subtype'] == 'OpenSearch'
        related_url['Type'] = 'GET SERVICE'
      end
      if related_url['Subtype'] == 'SERVICE CHAINING'
        related_url['Type'] = 'GET SERVICE'
        related_url['Subtype'] = 'WORKFLOW (SERVICE CHAIN)'
      end
      if related_url['Subtype'] == 'TABULAR DATA STREAM (TDS)'
        related_url['Type'] = 'GET SERVICE'
        related_url.delete('Subtype')
      end
      if related_url['Subtype'] == 'THREDDS DATA'
        related_url['Type'] = 'GET SERVICE'
      end
      if related_url['Subtype'] == 'WEB COVERAGE SERVICE (WCS)'
        related_url['Type'] = 'GET SERVICE'
      end
      if related_url['Subtype'] == 'WEB FEATURE SERVICE (WFS)'
        related_url['Type'] = 'GET SERVICE'
      end
      if related_url['Subtype'] == 'WEB MAP SERVICE (WMS)'
        related_url['Type'] = 'GET SERVICE'
      end
      if related_url['Subtype'] == 'WEB MAP TILE SERVICE (WMTS)'
        related_url['Type'] = 'GET SERVICE'
        related_url['Subtype'] = 'WEB MAP SERVICE (WMS)'
      end
    end

  end

  def down_update_publication_url(related_url)
    if related_url['Type'] == 'VIEW RELATED INFORMATION'
      if related_url['Subtype'] == 'ALGORITHM DOCUMENTATION'
        related_url['Subtype'] = 'GENERAL DOCUMENTATION'
      end
      if related_url['Subtype'] == 'ALGORITHM THEORETICAL BASIS DOCUMENT (ATBD)'
        related_url['Subtype'] = 'ALGORITHM THEORETICAL BASIS DOCUMENT'
      end
      if related_url['Subtype'] == 'ANOMALIES'
        related_url.delete('Subtype')
      end
      if related_url['Subtype'] == 'DATA CITATION POLICY'
        related_url.delete('Subtype')
      end
      if related_url['Subtype'] == 'DATA RECIPE'
        related_url['Subtype'] = 'RECIPE'
      end
      if related_url['Subtype'] == 'IMPORTANT NOTICE'
        related_url.delete('Subtype')
      end
      if related_url['Subtype'] == 'INSTRUMENT/SENSOR CALIBRATION DOCUMENTATION'
        related_url['Subtype'] = 'CALIBRATION DATA DOCUMENTATION'
      end
      if related_url['Subtype'] == 'MICRO ARTICLE'
        related_url.delete('Subtype')
      end
      if related_url['Subtype'] == 'USER FEEDBACK PAGE'
        related_url['Subtype'] = 'USER FEEDBACK'
      end
    end
  end

  def down_update_visualization_url(related_url)
    if related_url['Type'] == 'GET RELATED VISUALIZATION'
      if related_url['Subtype'] == 'WORLDVIEW'
        related_url['Subtype'] = 'GIBS'
      end
    end
  end

end
