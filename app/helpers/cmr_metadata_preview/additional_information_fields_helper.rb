# Some of these helper files from the old metadata preview are still being used elsewhere in MMT, so we need to keep
# them.
module CmrMetadataPreview
  module AdditionalInformationFieldsHelper
    def display_location_keywords(metadata)
      unless metadata['LocationKeywords'].blank?
        keywords = metadata['LocationKeywords']
        order_subfields!(%w(Category Type Subregion1 Subregion2 Subregion3 DetailedLocation),
                                  keywords)
        keywords.sort! { |k1,k2| k1.values.join(">") <=> k2.values.join(">") }

        keyword_values = []
        keywords.each do |keyword|
          keyword_values += keyword.values
        end

        content_tag(:ul, nil, class: 'location-keywords-preview arrow-keywords-preview is-condensed') do
          concat(content_tag(:li, nil, class: 'location-keywords') do
            keywords.each_with_index do |keyword, index|
              concat(content_tag(:ul, nil, class: "arrow-tag-group-list #{'arrow-keywords-more-item is-hidden' if index > 2}") do
                keyword.each do |_key, value|
                  concat(content_tag(:li, value, class: 'arrow-tag-group-item'))
                end
              end)
            end
          end)

          if keywords.size > 3
            concat(content_tag(:a, 'Show More', href: '#', class: 'show-more-toggle', data: { parent_class: '.arrow-keywords-preview', list_item: '.arrow-keywords-more-item' }))
            concat(content_tag(:a, 'Show Less', href: '#', class: 'show-less-toggle is-hidden', data: { parent_class: '.arrow-keywords-preview', list_item: '.arrow-keywords-more-item' }))
          end
        end
      end
    end

    def display_range_xy_fields(range_res_item)
      if range_res_item['MinimumXDimension'] || range_res_item['MaximumXDimension']
        concat(content_tag(:div, nil, class: 'row') do
          concat(content_tag(:div, nil, class: 'col-6') do
            concat(content_tag(:span, 'X Dimension Minimum', class: 'field-name'))
            concat(content_tag(:p, "#{range_res_item['MinimumXDimension']} #{range_res_item['Unit']}"))
          end)

          concat(content_tag(:div, nil, class: 'col-6') do
            concat(content_tag(:span, 'X Dimension Maximum', class: 'field-name'))
            concat(content_tag(:p, "#{range_res_item['MaximumXDimension']} #{range_res_item['Unit']}"))
          end)
        end)
      end

      if range_res_item['MinimumYDimension'] || range_res_item['MaximumYDimension']
        concat(content_tag(:div, nil, class: 'row') do
          concat(content_tag(:div, nil, class: 'col-6') do
            concat(content_tag(:span, 'Y Dimension Minimum', class: 'field-name'))
            concat(content_tag(:p, "#{range_res_item['MinimumYDimension']} #{range_res_item['Unit']}"))
          end)

          concat(content_tag(:div, nil, class: 'col-6') do
            concat(content_tag(:span, 'Y Dimension Maximum', class: 'field-name'))
            concat(content_tag(:p, "#{range_res_item['MaximumYDimension']} #{range_res_item['Unit']}"))
          end)
        end)
      end
    end

    def display_xy_dimension_fields(res_item)
      concat(content_tag(:div, nil, class: 'row') do
        if res_item['XDimension']
          concat(content_tag(:div, nil, class: 'col-6') do
            concat(content_tag(:span, 'X Dimension', class: 'field-name'))
            concat(content_tag(:p, "#{res_item['XDimension']} #{res_item['Unit']}"))
          end)
        end

        if res_item['YDimension']
          concat(content_tag(:div, nil, class: 'col-6') do
            concat(content_tag(:span, 'Y Dimension', class: 'field-name'))
            concat(content_tag(:p, "#{res_item['YDimension']} #{res_item['Unit']}"))
          end)
        end
      end)
    end

    def display_non_gridded_fields(non_gridded_res_item)
      if non_gridded_res_item['ViewingAngleType'] || non_gridded_res_item['ScanDirection']
        concat(content_tag(:div, nil, class: 'row') do
          if non_gridded_res_item['ViewingAngleType']
            concat(content_tag(:div, nil, class: 'col-6') do
              concat(content_tag(:span, 'Viewing Angle Type', class: 'field-name'))
              concat(content_tag(:p, non_gridded_res_item['ViewingAngleType']))
            end)
          end

          if non_gridded_res_item['ScanDirection']
            concat(content_tag(:div, nil, class: 'col-6') do
              concat(content_tag(:span, 'Scan Direction', class: 'field-name'))
              concat(content_tag(:p, non_gridded_res_item['ScanDirection']))
            end)
          end
        end)
      end
    end

    def display_horizontal_data_resolution(horizontal_data_resolution)
      content_tag(:ul) do

        # single items
        point_res = horizontal_data_resolution.fetch('PointResolution', {})
        unless point_res.blank?
          concat(content_tag(:li, class: 'point_resolution') do
            concat(content_tag(:h5, 'Point Resolution'))

            concat(content_tag(:ul) do
              concat(content_tag(:li) do
                concat(content_tag(:p, point_res))
              end)
            end)
          end)
        end

        varies_res = horizontal_data_resolution.fetch('VariesResolution', {})
        unless varies_res.blank?
          concat(content_tag(:li, class: 'varies_resolution') do
            concat(content_tag(:h5, 'Varies Resolution'))

            concat(content_tag(:ul) do
              concat(content_tag(:li) do
                concat(content_tag(:p, varies_res))
              end)
            end)
          end)
        end

        # multi-items
        non_gridded_res = horizontal_data_resolution.fetch('NonGriddedResolutions', [])
        unless non_gridded_res.blank?
          concat(content_tag(:li, class: 'non_gridded_resolutions') do
            concat(content_tag(:h5, "Non Gridded Resolutions"))

            concat(content_tag(:ul) do
              non_gridded_res.each_with_index do |non_gridded, index|
                concat(content_tag(:li, class: "non_gridded_resolution_#{index}") do
                  concat(content_tag(:h5, "Non Gridded Resolution #{index + 1}"))

                  display_xy_dimension_fields(non_gridded)

                  display_non_gridded_fields(non_gridded)
                end)
              end
            end)
          end)
        end

        non_gridded_range_res = horizontal_data_resolution.fetch('NonGriddedRangeResolutions', [])
        unless non_gridded_range_res.blank?
          concat(content_tag(:li, class: 'non_gridded_range_resolutions') do
            concat(content_tag(:h5, "Non Gridded Range Resolutions"))

            concat(content_tag(:ul) do
              non_gridded_range_res.each_with_index do |non_gridded_range, index|
                concat(content_tag(:li, class: "non_gridded_range_resolution_#{index}") do
                  concat(content_tag(:h5, "Non Gridded Range Resolution #{index + 1}"))

                  display_range_xy_fields(non_gridded_range)

                  display_non_gridded_fields(non_gridded_range)
                end)
              end
            end)
          end)
        end

        gridded_res = horizontal_data_resolution.fetch('GriddedResolutions', [])
        unless gridded_res.blank?
          concat(content_tag(:li, class: 'gridded_resolutions') do
            concat(content_tag(:h5, 'Gridded Resolutions'))

            concat(content_tag(:ul) do
              gridded_res.each_with_index do |gridded, index|
                concat(content_tag(:li, class: "gridded_resolution_#{index}") do
                  concat(content_tag(:h5, "Gridded Resolution #{index + 1}"))

                  display_xy_dimension_fields(gridded)
                end)
              end
            end)
          end)
        end

        gridded_range_res = horizontal_data_resolution.fetch('GriddedRangeResolutions', [])
        unless gridded_range_res.blank?
          concat(content_tag(:li, class: 'gridded_range_resolutions') do
            concat(content_tag(:h5, 'Gridded Range Resolutions'))

            concat(content_tag(:ul) do
              gridded_range_res.each_with_index do |gridded_range, index|
                concat(content_tag(:li, class: "gridded_range_resolution_#{index}") do
                  concat(content_tag(:h5, "Gridded Range Resolution #{index + 1}"))

                  display_range_xy_fields(gridded_range)
                end)
              end
            end)
          end)
        end

        generic_res = horizontal_data_resolution.fetch('GenericResolutions', [])
        unless generic_res.blank?
          concat(content_tag(:li, class: 'generic_resolutions') do
            concat(content_tag(:h5, 'Generic Resolutions'))

            concat(content_tag(:ul) do
              generic_res.each_with_index do |generic, index|
                concat(content_tag(:li, class: "generic_resolution_#{index}") do
                  concat(content_tag(:h5, "Generic Resolution #{index + 1}"))

                  display_xy_dimension_fields(generic)
                end)
              end
            end)
          end)
        end
      end
    end

    def display_direct_distribution_information(direct_distribution_information)
      if !direct_distribution_information
        content_tag(:p, 'There is no direct distribution information for this collection.', class:'empty-section')
      else
        content_tag(:div, class: 'archive-and-distribution-information-preview') do
          concat(content_tag(:h5, 'Direct Distribution Information'))
          concat(content_tag(:ul, class: 'direct-distribution-information-preview') do
            concat(content_tag(:li, class: "direct-distribution-information", itemtype: "http://schema.org/CreativeWork", ' itemscope' => '') do
              display_s3_item(direct_distribution_information['Region'], 'Region')
              display_s3_item(direct_distribution_information['S3BucketAndObjectPrefixNames'], 'S3 Bucket and Object Prefix Names')
              display_s3_item(direct_distribution_information['S3CredentialsAPIEndpoint'], 'S3 Credentials API Endpoint')
              display_s3_item(direct_distribution_information['S3CredentialsAPIDocumentationURL'], 'S3 Credentials API Documentation URL')
            end)
          end)
        end
      end
    end

    def display_s3_item(s3_item, label)
      if s3_item
        concat(content_tag(:p) do
          concat(content_tag(:span, "#{label}: ", class: 'field-name'))
          concat(content_tag(:span, s3_item.is_a?(Array) ? s3_item.join(', ') : s3_item ))
        end)
      end
    end
  end
end
