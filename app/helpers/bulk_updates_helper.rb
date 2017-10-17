module BulkUpdatesHelper
  # * For the scope of MMT-874 all fields are text fields but as we move toward
  #   a more complex and functional filtering tool we should make data entry
  #   easier by supplying the correct input for the data type.
  SEARCHABLE_KEYS = {
    collection_data_type: {
      title: 'Collection Data Type',
      data_attributes: {
        supports_wildcard: false,
        format: 'text'
      }
    },
    concept_id: {
      title: 'Concept ID',
      data_attributes: {
        supports_wildcard: false,
        format: 'text'
      }
    },
    data_center: {
      title: 'Data Center',
      data_attributes: {
        supports_wildcard: true,
        format: 'text'
      }
    },
    doi: {
      title: 'DOI Value',
      data_attributes: {
        supports_wildcard: false,
        format: 'text'
      }
    },
    entry_title: {
      title: 'Entry Title',
      data_attributes: {
        supports_wildcard: true,
        format: 'text'
      }
    },
    instrument: {
      title: 'Instrument',
      data_attributes: {
        supports_wildcard: true,
        format: 'text'
      }
    },
    platform: {
      title: 'Platform',
      data_attributes: {
        supports_wildcard: true,
        format: 'text'
      }
    },
    processing_level_id: {
      title: 'Processing Level ID',
      data_attributes: {
        supports_wildcard: true,
        format: 'text'
      }
    },
    project: {
      title: 'Project',
      data_attributes: {
        supports_wildcard: true,
        format: 'text'
      }
    },
    revision_date: {
      title: 'Revision Date',
      data_attributes: {
        supports_wildcard: false,
        format: 'single_date'
      }
    },
    science_keywords: {
      title: 'Science Keywords',
      data_attributes: {
        supports_wildcard: false,
        format: 'text',
        description: 'Searches for provided search term at all levels of the science keyword hierarchy.'
      }
    },
    short_name: {
      title: 'Short Name',
      data_attributes: {
        supports_wildcard: true,
        format: 'text'
      }
    },
    spatial_keyword: {
      title: 'Spatial Keyword',
      data_attributes: {
        supports_wildcard: true,
        format: 'text'
      }
    },
    temporal: {
      title: 'Temporal Extent',
      data_attributes: {
        supports_wildcard: false,
        format: 'double_date'
      }
    },
    two_d_coordinate_system_name: {
      title: 'Tiling Identification System Name',
      data_attributes: {
        supports_wildcard: false,
        format: 'text'
      }
    },
    updated_since: {
      title: 'Updated Since',
      data_attributes: {
        supports_wildcard: false,
        format: 'single_date'
      }
    },
    version: {
      title: 'Version',
      data_attributes: {
        supports_wildcard: true,
        format: 'text'
      }
    }
  }.freeze

  # CMR expects these values to be in ALL_CAPS with underscores, but the downcase
  # version works better for Rails values and partials, so we need to make sure
  # to upcase them before sending to CMR
  UPDATEABLE_FIELDS = [
    ['Data Centers', 'data_centers'],
    ['Location Keywords', 'location_keywords'],
    ['Science Keywords', 'science_keywords'],
    ['Platforms', 'platforms']
  ].freeze
  # these are the other possible update-field values in the CMR enum:
  # 'LOCATION_KEYWORDS','DATA_CENTERS','PLATFORMS','INSTRUMENTS'

  UPDATE_TYPES = {
    ADD_TO_EXISTING: {
      title: 'Add to Existing',
      data_attributes: {
        new_title: 'Value to Add',
        new_description: 'The new value provided below will be added to your selected collections.'
      },
      valid_fields: %w[science_keywords location_keywords]
    },
    CLEAR_ALL_AND_REPLACE: {
      title: 'Clear All & Replace',
      data_attributes: {
        new_title: 'New Value',
        new_description: 'The new value provided below will be added to your selected collections and all previous values will be removed.'
      },
      valid_fields: %w[science_keywords location_keywords]
    },
    FIND_AND_REMOVE: {
      title: 'Find & Remove',
      data_attributes: {
        find_title: 'Find Values to Remove',
        find_description: 'Use the following fields to find the value that you\'d like to remove from your selected collections.'
      },
      valid_fields: %w[science_keywords data_centers location_keywords platforms]
    },
    FIND_AND_REPLACE: {
      title: 'Find & Replace',
      data_attributes: {
        find_title: 'Find Values to Replace',
        find_description: 'Use the following fields to find the values that you\'d like to replace with the value provided below.',
        new_title: 'New Value',
        new_description: 'The value found using the above fields will be replaced with the value you provide here.'
      },
      valid_fields: %w[science_keywords location_keywords]
    },
    FIND_AND_UPDATE: {
      title: 'Find & Update',
      data_attributes: {
        find_title: 'Find Values to Update',
        find_description: 'Use the following fields to find the values that you\'d like to update with the value provided below.',
        new_title: 'New Value',
        new_description: 'The value found using the above fields will be updated with the value you provide here.'
      },
      valid_fields: %w[data_centers platforms]
    }
  }.freeze

  SCIENCE_KEYWORDS_HIERARCHY = %w[
    Category
    Topic
    Term
    VariableLevel1
    VariableLevel2
    VariableLevel3
    DetailedVariable
  ].freeze

  LOCATION_KEYWORDS_HIERARCHY = %w[
    Category
    Type
    Subregion1
    Subregion2
    Subregion3
    DetailedLocation
  ].freeze

  def update_type_select(field_to_update)
    # Construct the options for the select including the data attributes
    options = BulkUpdatesHelper::UPDATE_TYPES.map do |option, values|
      [values[:title], option.to_s, Hash[values.fetch(:data_attributes, {}).map { |key, value| ["data-#{key}", value] }]] if values[:valid_fields].include?(field_to_update)
    end.compact

    label_tag('update_type', 'Update Type') + select_tag('update_type', options_for_select(options), prompt: 'Select an Update Type')
  end

  def display_value_title(update_type, value_type)
    data_attributes = BulkUpdatesHelper::UPDATE_TYPES.fetch(update_type.to_sym, {}).fetch(:data_attributes, {})

    case value_type
    when 'new'
      title = data_attributes[:new_title]
      description = data_attributes[:new_description]
    when 'find'
      title = data_attributes[:find_title]
      description = data_attributes[:find_description]
    end

    "<h4>#{title}</h4><p>#{description}</p>".html_safe
  end

  def keyword_for_display(type, keyword)
    return {} if keyword.blank?

    # to construct the science keyword to display, we iterate through each level
    # of the hierarchy from bottom up. If we have not reached a value we delete
    # the key for that level as we don't need to display it. Once we find a value
    # any levels higher will also be kept and be given the display value that
    # indicates 'ANY_VALUE'

    reached_value = false
    display_keyword = keyword.dup

    keywords = if type == 'science'
                 BulkUpdatesHelper::SCIENCE_KEYWORDS_HIERARCHY
               else
                 BulkUpdatesHelper::LOCATION_KEYWORDS_HIERARCHY
               end

    keywords.reverse.each do |level|
      if (display_keyword[level].blank?) && !reached_value
        display_keyword.delete(level)
      elsif (display_keyword[level].blank?) && reached_value
        display_keyword[level] = "<em><b>#{level.upcase}</b>: ANY VALUE</em>".html_safe
      else
        reached_value = true
      end
    end

    display_keyword
  end

  def display_science_keyword(keyword)
    display_keyword = keyword_for_display('science', keyword)

    content_tag(:ul, class: 'arrow-tag-group-list') do
      BulkUpdatesHelper::SCIENCE_KEYWORDS_HIERARCHY.each do |level|
        unless display_keyword[level].blank?
          concat content_tag(:li, display_keyword[level], itemprop: 'keyword', class: 'arrow-tag-group-item')
        end
      end
    end
  end

  def display_location_keyword(keyword)
    display_keyword = keyword_for_display('location', keyword)

    content_tag(:ul, class: 'arrow-tag-group-list') do
      BulkUpdatesHelper::LOCATION_KEYWORDS_HIERARCHY.each do |level|
        unless display_keyword[level].blank?
          concat content_tag(:li, display_keyword[level], itemprop: 'keyword', class: 'arrow-tag-group-item')
        end
      end
    end
  end

  def display_data_center(data_center)
    content_tag(:ul, class: 'no-bullet') do
      if data_center.key? 'ShortName'
        concat(content_tag(:li) do
          concat content_tag(:strong, 'Short Name: ')
          concat content_tag(:span, data_center['ShortName'])
        end)
      end
      if data_center.key? 'LongName'
        concat(content_tag(:li) do
          concat content_tag(:strong, 'Long Name: ')
          concat content_tag(:span, data_center['LongName'])
        end)
      end
    end
  end

  def display_platform(platform)
    content_tag(:ul, class: 'no-bullet') do
      if platform.key?('ShortName')
        concat(content_tag(:li) do
          concat content_tag(:strong, 'Short Name: ')
          concat content_tag(:span, platform['ShortName'])
        end)
      end
      if platform.key?('LongName')
        concat(content_tag(:li) do
          concat content_tag(:strong, 'Long Name: ')
          concat content_tag(:span, platform['LongName'])
        end)
      end
    end
  end
end
