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
        format: 'date',
        description: 'Accepts dates in yyyy-mm-ddThh:mm:ss.SSSZ format.'
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
        format: 'text'
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
        format: 'date',
        description: 'Accepts dates in yyyy-mm-ddThh:mm:ss.SSSZ format.'
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

  UPDATEABLE_FIELDS = [
    ['Science Keywords', 'science_keywords']
  ].freeze

  UPDATE_TYPES = {
    ADD_TO_EXISTING: {
      title: 'Add to Existing',
      data_attributes: {
        new_title: 'Value to Add',
        new_description: 'The new value provided below will be added to your selected collections.'
      }
    },
    CLEAR_ALL_AND_REPLACE: {
      title: 'Clear All & Replace',
      data_attributes: {
        new_title: 'New Value',
        new_description: 'The new value provided below will be added to your selected collections and all previous values will be removed.'
      }
    },
    FIND_AND_REMOVE: {
      title: 'Find & Remove',
      data_attributes: {
        find_title: 'Find Values to Remove',
        find_description: 'Use the following fields to find the value that you\'d like to remove from your selected collections.'
      }
    },
    FIND_AND_REPLACE: {
      title: 'Find & Replace',
      data_attributes: {
        find_title: 'Find Values to Replace',
        find_description: 'Use the following fields to find the values that you\'d like to replace with the value provided below.',
        new_title: 'New Value',
        new_description: 'The value found using the above fields will be replaced with the value you provide here.'
      }
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

  def update_type_select
    # Construct the options for the select including the data attributes
    options = BulkUpdatesHelper::UPDATE_TYPES.map do |option, values|
      [values[:title], option.to_s, Hash[values.fetch(:data_attributes, {}).map { |key, value| ["data-#{key}", value] }]]
    end

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

  def display_science_keyword(keyword)
    return {} if keyword.blank?

    # to construct the science keyword to display, we iterate through each level
    # of the hierarchy from bottom up. If we have not reached a value we delete
    # the key for that level as we don't need to display it. Once we find a value
    # any levels higher will also be kept and be given the display value that
    # indicates 'ANY_VALUE'

    reached_value = false
    display_keyword = keyword.dup

    BulkUpdatesHelper::SCIENCE_KEYWORDS_HIERARCHY.reverse.each do |level|
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

  def prune_science_keyword(keyword)
    return {} if keyword.blank?

    # we are only concerned with passing along science keyword key-value pairs
    # that have a value, so we are deleting any that do not

    BulkUpdatesHelper::SCIENCE_KEYWORDS_HIERARCHY.reverse.each do |level|
      keyword.delete(level) if keyword[level].blank?
    end

    keyword
  end
end
