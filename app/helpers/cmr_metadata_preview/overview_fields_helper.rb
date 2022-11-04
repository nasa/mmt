module CmrMetadataPreview
  module OverviewFieldsHelper
    def display_overview_array_field(data)
      data.blank? ? 'n/a' : data.join(', ')
    end

    def display_overview_platforms(metadata)
      platform_short_names = metadata.fetch('Platforms', [{}]).map { |platform| platform['ShortName'].presence }.compact.uniq

      display_overview_array_field(platform_short_names)
    end

    def display_overview_instruments(metadata)
      instrument_short_names = []

      platforms = metadata.fetch('Platforms', [{}])
      platforms.each do |platform|
        instruments = platform.fetch('Instruments', [{}])
        instruments.each do |instrument|
          instrument_short_names << instrument['ShortName'].presence
        end
      end
      instrument_short_names = instrument_short_names.compact.uniq

      display_overview_array_field(instrument_short_names)
    end

    def display_overview_data_formats(metadata)
      archive_distribution_info = metadata.fetch('ArchiveAndDistributionInformation', {})
      file_archive_info = archive_distribution_info.fetch('FileArchiveInformation', [{}])
      file_distribution_info = archive_distribution_info.fetch('FileDistributionInformation', [{}])

      archive_formats = file_archive_info.map { |archive_info| archive_info['Format'].presence }.compact.uniq
      distribution_formats = file_distribution_info.map { |distribution_info| distribution_info['Format'].presence }.compact.uniq

      content_tag(:div) do
        if archive_formats.present?
          concat(content_tag(:span, "Archive: #{archive_formats.join(', ')}"))
        end

        if distribution_formats.present?
          concat(content_tag(:span, "Distribution: #{distribution_formats.join(', ')}"))
        end

        if archive_formats.blank? && distribution_formats.blank?
          concat(content_tag(:div, 'n/a'))
        end
      end
    end

    def display_overview_spatial_extent(preview_spatial)
      points = preview_spatial['point_coordinate_array'].map { |point| "Lat: #{point['lat']} Lon: #{point['lon']}" }
      rectangles = preview_spatial['rectangle_coordinate_array']

      content_tag(:div) do
        if points.present?
          concat(display_overview_points(points))
        end

        if rectangles.present?
          concat(display_overview_rectangles(rectangles))
        end

        if points.blank? && rectangles.blank?
          concat(content_tag(:div, 'n/a'))
        end
      end
    end

    def display_overview_points(points)
      content_tag(:span) do
        concat(content_tag(:div, 'Points: '))

        points.each_with_index do |point, index|
          concat(content_tag(:div, "Lat: #{point['lat']} Lon: #{point['lon']}#{', ' if index < points.size - 1}"))
        end
      end
    end

    def display_overview_rectangles(rectangles)
      content_tag(:span) do
        concat(content_tag(:div, 'Bounding Rectangle: '))

        rectangles.each_with_index do |rectangle, index|
          concat(content_tag(:meta, nil, {itemprop: 'spatialCoverage'}, false) do
            concat(content_tag(:div, nil, vocab: 'http://schema.org', typeof: 'Place') do
              concat(content_tag(:div, nil,  property: 'geo', typeof: 'GeoShape') do
                concat(content_tag(:meta, nil, property: 'box', content: "#{get_mbr(rectangle)}"))
              end)
            end)
          end)

          concat(content_tag(:div, "N: #{rectangle['north_bounding_coordinate']} S: #{rectangle['south_bounding_coordinate']} E: #{rectangle['east_bounding_coordinate']} W: #{rectangle['west_bounding_coordinate']}#{', ' if index < rectangles.size - 1}"))
        end
      end
    end

    def display_overview_temporal_extent(metadata)
      preview_temporal = get_preview_temporal(metadata)
      single_date_times = preview_temporal.fetch('single_date_times', [])
      range_date_times = preview_temporal.fetch('range_date_times', [])
      periodic_date_times = preview_temporal.fetch('periodic_date_times', [])

      content_tag(:div) do
        if single_date_times.present?
          concat(display_overview_single_date_times(single_date_times))
        end

        if range_date_times.present?
          concat(display_overview_range_date_times(range_date_times))
        end

        if periodic_date_times.present?
          concat(display_overview_periodic_date_times(periodic_date_times))
        end

        if single_date_times.blank? && range_date_times.blank? && periodic_date_times.blank?
          concat(content_tag(:div, 'n/a'))
        end

      end
    end

    def display_overview_single_date_times(single_date_times)
      content_tag(:span) do
        single_date_times.each_with_index do |single_date_time, index|
          concat(content_tag(:time, "#{single_date_time.split('T')[0]}#{', ' if index < single_date_times.size - 1}", itemprop: 'temporalCoverage', datetime: "#{single_date_time}")) # itemprop="temporalCoverage" datetime="#{single_date_time}"
        end
      end
    end

    def display_overview_range_date_times(range_date_times)
      content_tag(:span) do
        range_date_times.each_with_index do |range_date_time, index|
          beginning_date_time = range_date_time['beginning_date_time']
          ending_date_time = range_date_time['ending_date_time']

          if !ending_date_time.blank?
            concat(content_tag(:time, "#{beginning_date_time.split('T')[0]} to #{ending_date_time.split('T')[0]}#{', ' if index < range_date_times.size - 1}", itemprop: 'temporalCoverage', datetime: "#{beginning_date_time}/#{ending_date_time}"))
          else
            concat(content_tag(:time, "#{beginning_date_time.split('T')[0]} to now#{', ' if index < range_date_times.size - 1}", itemprop: 'temporalCoverage', datetime: "#{beginning_date_time}/.."))
          end
        end
      end
    end

    def display_overview_periodic_date_times(periodic_date_times)
      content_tag(:span) do
        concat(content_tag(:div, 'Periodic Ranges: '))

        periodic_date_times.each_with_index do |periodic_date_time, index|
          start_date = periodic_date_time['start_date']
          end_date = periodic_date_time['end_date']

          concat(content_tag(:time, "#{start_date.split('T')[0]} to #{end_date.split('T')[0]}#{', ' if index < periodic_date_times.size - 1}", itemprop: 'temporalCoverage', datetime: "#{start_date}/#{end_date}"))
        end
      end
    end

    def display_overview_science_keywords(metadata)
      if metadata['ScienceKeywords'].blank?
        content_tag(:p, 'n/a', class: 'empty-section')

      else
        keywords = metadata['ScienceKeywords']
        order_subfields!(%w(Category Topic Term VariableLevel1 VariableLevel2 VariableLevel3 DetailedVariable),
                        keywords)

        keywords.sort! { |k1,k2| k1.values.join(">") <=> k2.values.join(">") }
        keyword_values = []
        keywords.each do |keyword|
          keyword_values += keyword.values
        end

        iso_keywords = metadata.fetch('ISOTopicCategories', [])
        ancillary_keywords = metadata.fetch('AncillaryKeywords', [])

        content_tag(:div, nil, class: 'science-keywords-preview arrow-keywords-preview is-condensed') do
          concat(content_tag(:meta, nil, itemprop: 'keywords', content: "#{(keyword_values + iso_keywords + ancillary_keywords).uniq.join(',')}"))

          keywords.each_with_index do |keyword, index|
            concat(content_tag(:ul, nil, class: "arrow-tag-group-list #{'arrow-keywords-more-item is-hidden' if index > 2}") do
              keyword.each do |_key, value|
                concat(content_tag(:li, value, class: 'arrow-tag-group-item'))
              end
            end)
          end

          if keywords.size > 3
            concat(content_tag(:a, 'Show More', href: '#', class: 'show-more-toggle', data: { parent_class: '.arrow-keywords-preview', list_item: '.arrow-keywords-more-item' }))
            concat(content_tag(:a, 'Show Less', href: '#', class: 'show-less-toggle is-hidden', data: { parent_class: '.arrow-keywords-preview', list_item: '.arrow-keywords-more-item' }))
          end
        end
      end
    end

    def display_overview_data_contributors(metadata)
      # order for displaying data center: ORIGINATOR > DISTRIBUTOR > ARCHIVER > PROCESSOR
      data_centers = metadata.fetch('DataCenters', [{}])

      data_centers_by_role = {}

      data_centers.each do |data_center|
        if data_center.fetch('Roles', []).include?('ORIGINATOR')
          data_centers_by_role.key?('ORIGINATOR') ? data_centers_by_role['ORIGINATOR'] << data_center['ShortName'] : data_centers_by_role['ORIGINATOR'] = [data_center['ShortName']]
        elsif data_center.fetch('Roles', []).include?('DISTRIBUTOR')
          data_centers_by_role.key?('DISTRIBUTOR') ? data_centers_by_role['DISTRIBUTOR'] << data_center['ShortName'] : data_centers_by_role['DISTRIBUTOR'] = [data_center['ShortName']]
        elsif data_center.fetch('Roles', []).include?('ARCHIVER')
          data_centers_by_role.key?('ARCHIVER') ? data_centers_by_role['ARCHIVER'] << data_center['ShortName'] : data_centers_by_role['ARCHIVER'] = [data_center['ShortName']]
        elsif data_center.fetch('Roles', []).include?('PROCESSOR')
          data_centers_by_role.key?('PROCESSOR') ? data_centers_by_role['PROCESSOR'] << data_center['ShortName'] : data_centers_by_role['PROCESSOR'] = [data_center['ShortName']]
        end
      end

      if data_centers_by_role.key?('ORIGINATOR')
        data_centers_by_role['ORIGINATOR'].join(', ')
      elsif data_centers_by_role.key?('DISTRIBUTOR')
        data_centers_by_role['DISTRIBUTOR'].join(', ')
      elsif data_centers_by_role.key?('ARCHIVER')
        data_centers_by_role['ARCHIVER'].join(', ')
      elsif data_centers_by_role.key?('PROCESSOR')
        data_centers_by_role['PROCESSOR'].join(', ')
      else
        'n/a'
      end
    end

    def nrt_badge(metadata)
      if metadata['CollectionDataType'] == 'NEAR_REAL_TIME'
        content_tag(:span, 'NRT', class: 'eui-badge nrt')
      elsif metadata['CollectionDataType'] == 'LOW_LATENCY'
        content_tag(:span, 'LOW LATENCY', class: 'eui-badge nrt')
      elsif metadata['CollectionDataType'] == 'EXPEDITED'
        content_tag(:span, 'EXPEDITED', class: 'eui-badge nrt')
      end
    end
  end
end
