module CmrMetadataPreview
  module RelatedUrlsPreviewHelper

    # These type hashes are to be fed into the parse_related_urls_for_tab
    # function.  The keys of the hashes are the related URL types and the values
    # are the subtypes.  If the value is blank, then all subtypes are assumed.
    # 'none' is used to flag a blank subtype as acceptable

    # If a Type is not provided, the URL will not be shown at all. Add'tly, having No 'Type' should only be possible as a Draft
    ADDITIONAL_INFORMATION_TYPES = {
      'DATA SET LANDING PAGE' => [],
      'DOWNLOAD SOFTWARE' => [],
      'EXTENDED METADATA' => [],
      'GET RELATED VISUALIZATION' => [],
      'GOTO WEB TOOL' => [],
      'PROFESSIONAL HOME PAGE' => [],
      'PROJECT HOME PAGE' => [],
      'USE SERVICE API' => [
        'GRADS DATA SERVER (GDS)',
        'MAP SERVICE',
        'OpenSearch',
        'SERVICE CHAINING',
        'TABULAR DATA STREAM (TDS)',
        'THREDDS DATA',
        'WEB COVERAGE SERVICE (WCS)',
        'WEB FEATURE SERVICE (WFS)',
        'WEB MAP SERVICE (WMS)',
        'WEB MAP TILE SERVICE (WMTS)',
        'none'
      ],
      'VIEW RELATED INFORMATION' => [
        'CASE STUDY',
        'DATA QUALITY',
        'DELIVERABLES CHECKLIST',
        'IMPORTANT NOTICE',
        'MICRO ARTICLE',
        'PRODUCT HISTORY',
        'PRODUCT QUALITY ASSESSMENT',
        'PRODUCT USAGE',
        'PRODUCTION HISTORY',
        'PUBLICATIONS',
        'USER FEEDBACK PAGE',
        'none'
      ]
    }.freeze

    CITATION_TYPES = {
      'VIEW RELATED INFORMATION' => [
        'DATA CITATION POLICY'
      ]
    }.freeze

    DOCUMENTATION_TYPES = {
      'VIEW RELATED INFORMATION' => [
        'ALGORITHM DOCUMENTATION',
        'ALGORITHM THEORETICAL BASIS DOCUMENT (ATBD)',
        'ANOMALIES',
        'DATA RECIPE',
        'GENERAL DOCUMENTATION',
        'HOW-TO',
        'INSTRUMENT/SENSOR CALIBRATION DOCUMENTATION',
        'PI DOCUMENTATION',
        'PROCESSING HISTORY',
        'READ-ME',
        'REQUIREMENTS AND DESIGN',
        'SCIENCE DATA PRODUCT SOFTWARE DOCUMENTATION',
        'SCIENCE DATA PRODUCT VALIDATION',
        "USER'S GUIDE"
      ]
    }.freeze

    DOWNLOAD_DATA_TYPES = {
      'GET CAPABILITIES' => [],
      'GET DATA' => [],
      'USE SERVICE API' => ['OPENDAP DATA']
    }.freeze

    DOWNLOAD_DATA_CONTENT_URLS = [
      'OPENDAP DATA'
    ].freeze

    def parse_related_urls_for_tab(metadata:, type_and_subtype_map: {})
      related_urls = metadata.fetch('RelatedUrls', [])
      related_urls.select do |related_url|
        next unless type_and_subtype_map.keys.include?(related_url['Type'])
        related_url['Subtype'] = CGI.unescapeHTML(related_url['Subtype']) unless(related_url['Subtype'].blank?)
        related_url['Description'] = CGI.unescapeHTML(related_url['Description']) unless(related_url['Description'].blank?)

        subtype_array = type_and_subtype_map[related_url['Type']]

        subtype_array.blank? ||
          subtype_array.include?(related_url['Subtype']) ||
          (subtype_array.include?('none') && related_url['Subtype'].blank?)
      end
    end

    def display_preview_documentation(metadata)
      documentation_urls = parse_related_urls_for_tab(metadata: metadata, type_and_subtype_map: DOCUMENTATION_TYPES)

      if documentation_urls.blank?
        'Documentation information is not available for this collection.'
      else
        content_tag(:ul) do
          documentation_urls.each do |documentation_url|
            label = documentation_url['Subtype']
            url = documentation_url.fetch('URL', 'URL Not Provided')
            description = documentation_url.fetch('Description', '')
            display_list_item_with_link(label: label, url: url, description: description, schema_org_parameters: nil)
          end
        end
      end
    end

    def display_download_data(metadata)
      download_data_urls = parse_related_urls_for_tab(metadata: metadata, type_and_subtype_map: DOWNLOAD_DATA_TYPES)

      if download_data_urls.blank?
        'A direct link to download data is not available for this collection.'
      else
        content_tag(:div) do
          concat(content_tag(:span, 'Download Options', class: 'panel-title'))
          concat(content_tag(:ul, nil, class: 'download-data-related-urls') do
            download_data_urls.each_with_index do |download_data_url, index|
              description = download_data_url.fetch('Description', '')
              sub_type = download_data_url['Subtype'] || download_data_url['Type']

              url = download_data_url.fetch('URL', 'URL Not Provided')
              mime_type = download_data_url.fetch('GetData', {}).fetch('MimeType', nil)

              url_options = if download_data_url['URLContentType'] == 'DistributionURL'
                              { itemprop: 'distribution', itemscope: 'itemscope', itemtype: 'http://schema.org/DataDownload' }
                            elsif download_data_url['URLContentType'] == 'PublicationURL'
                              {}
                            else
                              { itemprop: "#{index == 0 ? 'url' : 'sameAs'}" }
                            end

              schema_org_parameters = if DOWNLOAD_DATA_CONTENT_URLS.include?(sub_type)
                                        [
                                          { itemprop: 'contentUrl', content: format_url(url) },
                                          { itemprop: 'encodingFormat', content: mime_type }
                                        ]
                                      else
                                        [{ itemprop: 'encodingFormat', content: mime_type }]
                                      end

              li_options = { class: 'download-data-related-url' }
              display_list_item_with_link(label: sub_type, url: url, description: description, schema_org_parameters: schema_org_parameters, url_options: url_options, li_options: li_options)
            end
          end)
        end
      end
    end

    def display_additional_information_related_urls(metadata)
      add_info_related_urls = parse_related_urls_for_tab(metadata: metadata, type_and_subtype_map: ADDITIONAL_INFORMATION_TYPES)

      content_tag(:div) do
        unless add_info_related_urls.blank?
          concat(content_tag(:h5, 'Related URLs'))

          concat(content_tag(:ul, nil, class: 'related-urls-preview') do
            add_info_related_urls.each_with_index do |add_info_url, index|
              description = add_info_url.fetch('Description', '')
              url = add_info_url.fetch('URL', 'URL Not Provided')
              mime_type = add_info_url.fetch('GetData', {}).fetch('MimeType', nil)
              sub_type = add_info_url.fetch('Subtype', nil)

              label = sub_type ? sub_type : add_info_url['Type']

              url_options = if add_info_url['URLContentType'] == 'DistributionURL'
                              { itemprop: 'distribution', itemscope: 'itemscope', itemtype: 'http://schema.org/DataDownload' }
                            elsif add_info_url['URLContentType'] == 'PublicationURL'
                              {}
                            else
                              { itemprop: "#{index == 0 ? 'url' : 'sameAs'}" }
                            end
              schema_org_options = add_info_url['URLContentType'] == 'DistributionURL' ? [{ itemprop: 'contentUrl', content: format_url(url) }, { itemprop: 'encodingFormat', content: mime_type }] : [{}]
              li_options = { class: 'related-url' }

              display_list_item_with_link(label: label, url: url, description: description, schema_org_parameters: schema_org_options, url_options: url_options, li_options: li_options)
            end
          end)
        end
      end
    end
  end
end
