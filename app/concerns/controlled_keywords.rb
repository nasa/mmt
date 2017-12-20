# :nodoc:
module ControlledKeywords
  extend ActiveSupport::Concern

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

  def set_science_keywords
    response = cmr_client.get_controlled_keywords('science_keywords')
    @science_keywords = if response.success?
                          response.body
                        else
                          []
                        end
  end

  def set_location_keywords
    response = cmr_client.get_controlled_keywords('spatial_keywords')
    @location_keywords = if response.success?
                           response.body
                         else
                           []
                         end
  end

  def set_data_centers
    response = cmr_client.get_controlled_keywords('data_centers')
    @data_centers = if response.success?
                      data_centers = get_controlled_keyword_short_names(response.body.fetch('level_0', []))

                      data_centers.flatten.sort { |a, b| a[:short_name] <=> b[:short_name] }
                    else
                      []
                    end
  end

  def set_platform_types
    response = cmr_client.get_controlled_keywords('platforms')

    # sets platform types with nested short_name and long_name values
    @platform_types = if response.success?
                        platform_types = response.body.fetch('category', []).map do |category|
                          short_names = get_controlled_keyword_short_names(Array.wrap(category))

                          {
                            type: category['value'],
                            short_names: short_names.flatten.sort { |a, b| a[:short_name] <=> b[:short_name] }
                          }
                        end
                        platform_types.sort { |a, b| a[:type] <=> b[:type] }
                      else
                        []
                      end
  end

  def set_instruments
    response = cmr_client.get_controlled_keywords('instruments')
    @instruments = unless response.success?
                     instruments = get_controlled_keyword_short_names(response.body.fetch('category', []))

                     instruments.flatten.sort { |a, b| a[:short_name] <=> b[:short_name] }
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
end
