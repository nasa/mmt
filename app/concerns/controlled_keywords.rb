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
    @science_keywords = cmr_client.get_controlled_keywords('science_keywords')
  end

  def set_location_keywords
    @location_keywords = cmr_client.get_controlled_keywords('spatial_keywords')
  end

  def set_data_centers
    data_centers = get_controlled_keyword_short_names(cmr_client.get_controlled_keywords('data_centers').fetch('level_0', []))

    @data_centers = data_centers.flatten.sort { |a, b| a[:short_name] <=> b[:short_name] }
  end

  def set_platform_types
    # sets platform types with nested short_name and long_name values
    @platform_types = cmr_client.get_controlled_keywords('platforms')['category'].map do |category|
      short_names = get_controlled_keyword_short_names(Array.wrap(category))

      {
        type: category['value'],
        short_names: short_names.flatten.sort { |a, b| a[:short_name] <=> b[:short_name] }
      }
    end

    @platform_types.sort! { |a, b| a[:type] <=> b[:type] }
  end

  def set_instruments
    @instruments = get_controlled_keyword_short_names(cmr_client.get_controlled_keywords('instruments').fetch('category', []))

    @instruments.flatten!.sort! { |a, b| a[:short_name] <=> b[:short_name] }
  end

  def set_projects
    @projects = cmr_client.get_controlled_keywords('projects').fetch('short_name', []).map do |short_name|
      {
        short_name: short_name['value'],
        long_name: short_name.fetch('long_name', [{}]).first['value']
      }
    end
    @projects.sort! { |a, b| a[:short_name] <=> b[:short_name] }
  end

  def set_temporal_keywords
    keywords = cmr_client.get_controlled_keywords('temporal_keywords')['temporal_resolution_range']
    @temporal_keywords = keywords.map { |keyword| keyword['value'] }.sort
  end
end
