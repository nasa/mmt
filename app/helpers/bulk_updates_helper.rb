module BulkUpdatesHelper
  # * For the scope of MMT-874 all fields are text fields but as we move toward
  #   a more complex and functional filtering tool we should make data entry
  #   easier by supplying the correct input for the data type.
  SEARCHABLE_KEYS = {
    two_d_coordinate_system_name: {
      title: 'Tiling Identification System Name',
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
    doi: {
      title: 'DOI Value',
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
    collection_data_type: {
      title: 'Collection Data Type',
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
        supports_wildcard: false,
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
end
