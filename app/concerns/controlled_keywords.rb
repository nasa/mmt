# :nodoc:
module ControlledKeywords
  extend ActiveSupport::Concern

  RelatedURLTranslations = {
    'GIBS' => 'GIBS',
    'OpenSearch' => 'Open Search',
    'APPEEARS' => 'AppEEARS',
    'EOSDIS DATA POOL' => 'EOSDIS Data Pool',
    'GoLIVE Portal' => 'GoLIVE Portal',
    'IceBridge Portal' => 'IceBridge Portal',
    'LAADS' => 'LAADS',
    'LANCE' => 'LANCE',
    'MODAPS' => 'MODAPS',
    'NOAA CLASS' => 'NOAA Class',
    'NOMADS' => 'NOMADS',
    'PORTAL' => 'PORTAL',
    'USGS EARTH EXPLORER' => 'USGS Earth Explorer',
    'GRADS DATA SERVER (GDS)' => 'GrADS Data Server (GDS)',
    'OPENDAP DATA' => 'OPeNDAP Data',
    'USE SERVICE API' => 'Use Service API',
    'HITIDE' => 'HITIDE',
    'SOTO' => 'SOTO',
    'Sub-Orbital Order Tool' => 'Sub-Orbital Order Tool',
    'CERES Ordering Tool' => 'CERES Ordering Tool'
  }

  UMMCRelatedURLContentTypes = %w(
    CollectionURL
    DistributionURL
    PublicationURL
    VisualizationURL
  )

  UMMCDataCenterContentType = ['DataCenterURL']

  UMMCDataContactContentType = ['DataContactURL']

  def get_controlled_keyword_short_names(keywords)
    keywords.map do |keyword|
      values = []
      keyword.fetch('subfields', []).each do |subfield|
        values += if subfield == 'short_name'
                    keyword.fetch('short_name', []).map do |short_name|
                      url = short_name.fetch('url', [{}]).first['value'] || short_name.fetch('long_name', [{}]).first.fetch('url', [{}]).first['value']

                      {
                        short_name: short_name['value'],
                        long_name: short_name.fetch('long_name', [{}]).first['value'],
                        url: url
                      }
                    end
                  else
                    get_controlled_keyword_short_names(keyword.fetch(subfield, []))
                  end
      end
      values.flatten
    end
  end

  def fetch_science_keywords
    response = cmr_client.get_controlled_keywords('science_keywords')
    if response.success?
      response.body
    else
      []
    end
  end

  def set_science_keywords
    keywords = fetch_science_keywords
    if keywords.key? 'category'
      keywords['category'].each do |category|
        if category['value'] == 'EARTH SCIENCE SERVICES'
          keywords['category'].delete(category)
          break
        end
      end
    end
    @science_keywords = keywords
  end

  def set_service_keywords
    keywords = fetch_science_keywords
    if keywords.key? 'category'
      keywords['category'].each do |category|
        if category['value'] == 'EARTH SCIENCE'
          keywords['category'].delete(category)
          break
        end
      end
    end
    @service_keywords = keywords
  end

  # for UMM-T v 1.0, Tool Keywords are using the same set of Service Keywords
  # this is supposed to change in the future
  def set_tool_keywords
    keywords = fetch_science_keywords
    if keywords.key? 'category'
      keywords['category'].each do |category|
        if category['value'] == 'EARTH SCIENCE'
          keywords['category'].delete(category)
          break
        end
      end
    end
    @tool_keywords = keywords
  end

  def set_location_keywords
    response = cmr_client.get_controlled_keywords('spatial_keywords')
    @location_keywords = if response.success?
                           response.body
                         else
                           []
                         end
  end

  def fetch_granule_data_formats
    response = cmr_client.get_controlled_keywords('granule_data_format')
    if response.success?
      response.body['short_name']
    else
      []
    end
  end

  def set_granule_data_formats
    formats = fetch_granule_data_formats
    formats.map! { |h| h['value'] }
    @granule_data_formats = formats.sort << 'Not provided' unless formats.include?('Not provided')
  end

  def set_data_centers
    @data_centers = fetch_data_centers.map { |data_center| [data_center.fetch(:short_name, ''), data_center.fetch(:short_name, ''), { 'data-long-name' => data_center[:long_name], 'data-url' => data_center[:url] }] }
  end

  def fetch_data_centers
    response = cmr_client.get_controlled_keywords('data_centers')

    if response.success?
      data_centers = get_controlled_keyword_short_names(response.body.fetch('level_0', []))

      data_centers.flatten.sort_by { |a| a[:short_name] }
    else
      []
    end
  end

  def set_platform_types
    @platform_types = fetch_platforms.map { |platform| [platform[:type], platform[:short_names].map { |sn| [sn[:short_name], 'data-long-name' => sn[:long_name], 'data-type' => platform[:type]] }] }
  end

  def set_platform_short_names
    @platform_short_names = fetch_platforms.map { |type| type[:short_names].map { |short_name| short_name[:short_name] } }.flatten
  end

  def fetch_platforms
    response = cmr_client.get_controlled_keywords('platforms')

    # sets platform types with nested short_name and long_name values
    if response.success?
      platform_types = response.body.fetch('category', []).map do |category|
        short_names = get_controlled_keyword_short_names(Array.wrap(category))

        {
          type: category['value'],
          short_names: short_names.flatten.sort_by { |a| a[:short_name] }
        }
      end
      platform_types.sort_by { |a| a[:type] }
    else
      []
    end
  end

  def set_instruments
    @instruments = fetch_instruments.map { |instrument| [instrument[:short_name], instrument[:short_name], { 'data-long-name' => instrument[:long_name] }] }
  end

  def set_instrument_short_names
    @instrument_short_names = fetch_instruments.map { |short_name| short_name[:short_name] }.flatten
  end

  def fetch_instruments
    response = cmr_client.get_controlled_keywords('instruments')
    if response.success?
      instruments = get_controlled_keyword_short_names(response.body.fetch('category', []))

      instruments.flatten.sort_by { |a| a[:short_name] }
    else
      []
    end
  end

  def set_projects
    response = cmr_client.get_controlled_keywords('projects')
    @projects = if response.success?
                  projects = response.body.fetch('short_name', []).map do |short_name|
                    {
                      short_name: short_name['value'],
                      long_name: short_name.fetch('long_name', [{}]).first['value']
                    }
                  end
                  projects.sort { |a, b| a[:short_name] <=> b[:short_name] }
                else
                  []
                end
  end

  def set_temporal_keywords
    response = cmr_client.get_controlled_keywords('temporal_keywords')
    @temporal_keywords = if response.success?
                           keywords = response.body.fetch('temporal_resolution_range', [])

                           keywords.map { |keyword| keyword['value'] }.sort
                         else
                           []
                         end
  end

  def set_country_codes
    # put the US at the top of the country list
    country_codes = Carmen::Country.all.sort
    united_states = country_codes.delete(Carmen::Country.named('United States'))
    @country_codes = country_codes.unshift(united_states)
  end

  # Returns and sets:
  # { measurement_context_medium => { measurement_object => [measurement_quantities] } }
  def set_measurement_names
    cmr_response = cmr_client.get_controlled_keywords('measurement_name')
    measurements = cmr_response.body.fetch('context_medium', [])
    final_hash = {}
    measurements.each do |medium|
      medium_hash = {}
      medium.fetch('object', []).each do |object|
        quantities = []
        object.fetch('quantity', []).each do |quantity|
          quantities.push(quantity['value'])
        end
        medium_hash[object['value']] = quantities
      end
      final_hash[medium['value']] = medium_hash
    end
    @measurement_names = final_hash
  end

  def fetch_related_urls
    response = cmr_client.get_controlled_keywords('related_urls')
    if response.success?
      response.body
    else
      {}
    end
  end

  # js dealing with related url content type map expects
  # {
  #   '<URL Content Type value' => {
  #     'text' => '<humanized version of URL Content Type value',
  #     'types' => {
  #       '<Type value>' => {
  #         'text' => '<humanized Type value>',
  #         'Subtypes' => [
  #           ['<humanized subtype value', '<Subtype value>']
  #         ]
  #       }
  #     }
  #   }
  # }
  def set_related_url_mapping(limited_url_content_types)
    keywords = fetch_related_urls
    url_mapping = {}
    url_content_type_options = []
    url_type_options = []
    url_subtype_options = []

    keywords.fetch('url_content_type', [{}]).each do |kms_content_type|
      content_type_value = kms_content_type.fetch('value', nil)
      next unless content_type_value
      next unless limited_url_content_types.include?(content_type_value)

      url_mapping[content_type_value] = {
        'text' => humanize_url_content_type(content_type_value),
        'types' => {}
      }
      url_content_type_options << [humanize_url_content_type(content_type_value), content_type_value]

      url_type_mapping = url_mapping[content_type_value]['types']
      kms_content_type.fetch('type', [{}]).each do |kms_url_type|
        type_value = kms_url_type.fetch('value', nil)
        next unless type_value

        url_type_mapping[type_value] = {
          'text' => humanize_url_type_subtype(type_value),
          'subtypes' => []
        }
        url_type_options << [humanize_url_type_subtype(type_value), type_value]

        url_subtype_mapping = url_type_mapping[type_value]['subtypes']
        kms_url_type.fetch('subtype', [{}]).each do |kms_url_subtype|
          subtype_value = kms_url_subtype.fetch('value', nil)
          next unless subtype_value

          url_subtype_mapping << [humanize_url_type_subtype(subtype_value), subtype_value]
          url_subtype_options << [humanize_url_type_subtype(subtype_value), subtype_value]
        end
      end
    end

    [url_mapping, url_content_type_options, url_type_options, url_subtype_options]
  end

  def set_umm_c_related_urls
    @umm_c_related_url_mapping, @umm_c_related_url_content_type_options, @umm_c_related_url_type_options, @umm_c_related_url_subtype_options = set_related_url_mapping(UMMCRelatedURLContentTypes)
  end

  def set_data_center_related_url
    @data_center_related_url_mapping, @data_center_related_url_content_type_options, @data_center_related_url_type_options, @data_center_related_url_subtype_options = set_related_url_mapping(UMMCDataCenterContentType)
  end

  def set_data_contact_related_url
    @data_contact_related_url_mapping, @data_contact_related_url_content_type_options, @data_contact_related_url_type_options, @data_contact_related_url_subtype_options = set_related_url_mapping(UMMCDataContactContentType)
  end

  def humanize_url_content_type(content_type_value)
    content_type_value.underscore.split('_').map(&:capitalize).join(' ').sub('Url', 'URL')
  end

  def humanize_url_type_subtype(value)
    if RelatedURLTranslations.keys.include?(value)
      RelatedURLTranslations[value]
    elsif value.include?('URL')
      value.split.map(&:capitalize).join(' ').sub('Url', 'URL')
    elsif value.include?('-')
      value.split('-').map(&:capitalize).join(' ')
    elsif value.match?(/\(.*\)$/)
      value.split.map(&:capitalize).join(' ').sub(/\(.*\)/) { |p| p.upcase }
    else
      value.split.map(&:capitalize).join(' ')
    end
  end
end
