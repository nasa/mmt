FactoryBot.define do
  # This is a valid factory, used to test to make sure all the factories
  # that use all_required_fields will work
  factory :collection_draft_all_required_fields, class: CollectionDraft do
    draft_type { 'CollectionDraft' }
    native_id { 'required_fields_draft_id' }
    provider_id {'MMT_2'}
    draft { all_required_fields }
  end

  factory :collection_draft, class: CollectionDraft do
    # Empty draft
    provider_id { 'MMT_2' }
    draft_type { 'CollectionDraft' }
  end

  factory :mmt_1_collection_draft, class: CollectionDraft do
    provider_id { 'MMT_1' }
    draft_type { 'CollectionDraft' }
  end

  # Will trigger required fields error for data identification required fields
  factory :collection_draft_missing_required_fields, class: CollectionDraft do
    draft_type { 'CollectionDraft' }
    draft {{ 'ShortName' => '12345' }}
  end

  factory :collection_draft_nested_required_field, class: CollectionDraft do
    draft_type { 'CollectionDraft' }
    draft {
      all_required_fields.merge(
        'RelatedUrls' => [{
          'Description' => 'description'
        }]
      )
    }
  end

  factory :collection_draft_field_too_long, class: CollectionDraft do
    draft_type { 'CollectionDraft' }
    draft {
      all_required_fields.merge(
        'ShortName' => "#{'a' * 81}"
      )
    }
  end

  factory :collection_draft_field_too_high, class: CollectionDraft do
    draft_type { 'CollectionDraft' }
    draft {
      all_required_fields.merge(
        'SpatialExtent' => {
          'GranuleSpatialRepresentation' => 'CARTESIAN',
          'SpatialCoverageType' => 'HORIZONTAL',
          'HorizontalSpatialDomain' => {
            'ZoneIdentifier' => 'Zone ID',
            'Geometry' => {
              'CoordinateSystem' => 'CARTESIAN',
              'Points' => [{
                'Longitude' => 700, 'Latitude' => 38.805407
              }]
            }
          }
        }
      )
    }
  end

  factory :collection_draft_field_invalid_date, class: CollectionDraft do
    draft_type { 'CollectionDraft' }
    draft {
      all_required_fields.merge(
        'DataDates' => [{
          'Type' => 'CREATE',
          'Date' => '2015-07-01'
        }]
      )
    }
  end

  factory :collection_draft_field_invalid_pattern, class: CollectionDraft do
    draft_type { 'CollectionDraft' }
    draft {
      all_required_fields.merge(
        'DataCenters' => [{
          'Roles' => ['DISTRIBUTOR'],
          'ShortName' => 'AARHUS-HYDRO',
          'LongName' => 'Hydrogeophysics Group, Aarhus University '
        }]
      )
    }
  end

  factory :collection_draft_field_invalid_uri, class: CollectionDraft do
    draft_type { 'CollectionDraft' }
    draft {
      all_required_fields.merge(
        'RelatedUrls' => [{
          'URLs' => ['this is invalid']
        }]
      )
    }
  end

  factory :collection_draft_invalid_picklists, class: CollectionDraft do
    draft_type { 'CollectionDraft' }
    native_id { 'invalid_picklists_draft_id' }
    provider_id { 'MMT_2' }
    draft {
      all_required_fields.merge(
        'ShortName' => 'Invalid Picklists',
        'EntryTitle' => 'Invalid Picklist Draft',
        'ProcessingLevel' => {
          'Id' => '5'
        },
        'RelatedUrls' => [{
          'URLContentType' => 'badcontenttype'
        }, {
          'URLContentType' => 'DistributionURL',
          'Type' => 'GET SERVICE',
          'Subtype' => 'EARTHDATA SEARCH',
          'GetService' => {
            'MimeType' => 'badmimetype',
            'Protocol' => 'badprotocol'
          }
        }, {
          'URLContentType' => 'DistributionURL',
          'Type' => 'GET DATA',
          'Subtype' => 'DIF',
          'GetData' => {
            'Format' => 'badformat',
            'Unit' => 'badunit'
          }
        }],
        'DataLanguage' => 'english',
        'MetadataLanguage' => 'english',
        'Platforms' => [{
          'Type' => 'Aircraft',
          'ShortName' => 'test 1 P ShortName',
          'LongName' => 'test 1 P LongName'
        }],
        'DataCenters' => [{
          'Roles' => ['bad data center role'],
          'ShortName' => 'short_name',
          'LongName' => 'Long Name',
          'ContactInformation' => {
            'ContactMechanisms' => [{
              'Type' => 'bad contact mechanism type',
              'Value' => 'contactmech@email.com'
            }],
            'Addresses' => [{
              'Country' => 'usa'
            }, {
              'Country' => 'United States',
              'StateProvince' => 'maryland'
            }]
          },
          'ContactPersons' => [{
            'Roles' => ['bad data center contact person role'],
            'LastName' => 'Last Name',
            'ContactInformation' => {
              'ContactMechanisms' => [{
                'Type' => 'bad contact mechanism type',
                'Value' => 'contactmech@email.com'
              }],
              'Addresses' => [{
                'Country' => 'usa'
              }, {
                'Country' => 'United States',
                'StateProvince' => 'maryland'
              }]
            }
          }],
          'ContactGroups' => [{
            'Roles' => ['bad data center contact group role'],
            'GroupName' => 'Group Name',
            'ContactInformation' => {
              'ContactMechanisms' => [{
                'Type' => 'bad contact mechanism type',
                'Value' => 'contactmech@email.com'
              }],
              'Addresses' => [{
                'Country' => 'usa'
              }, {
                'Country' => 'United States',
                'StateProvince' => 'maryland'
              }]
            }
          }]
        }],
        'ContactPersons' => [{
          'Roles' => ['bad non dc contact person role'],
          'LastName' => 'Last Name',
          'ContactInformation' => {
            'ContactMechanisms' => [{
              'Type' => 'bad contact mechanism type',
              'Value' => 'contactmech@email.com'
            }],
            'Addresses' => [{
              'Country' => 'usa'
            }, {
              'Country' => 'United States',
              'StateProvince' => 'maryland'
            }]
          }
        }],
        'ContactGroups' => [{
          'Roles' => ['bad non dc contact group role'],
          'GroupName' => 'Group Name',
          'ContactInformation' => {
            'ContactMechanisms' => [{
              'Type' => 'bad contact mechanism type',
              'Value' => 'contactmech@email.com'
            }],
            'Addresses' => [{
              'Country' => 'usa'
            }, {
              'Country' => 'United States',
              'StateProvince' => 'maryland'
            }]
          }
        }],
        'TemporalKeywords' => ['Keyword 1', 'Keyword 2'],
        'SpatialExtent' => {
          'GranuleSpatialRepresentation' => 'cartesian'
        },
        'CollectionProgress' => 'inwork'
      )
    }
  end

  factory :collection_draft_invalid_picklists_instruments, class: CollectionDraft do
    draft_type { 'CollectionDraft' }
    native_id { 'invalid_picklists_draft_id' }
    provider_id { 'MMT_2' }
    draft {
      all_required_fields.merge(
        'Platforms' => [{
          'Type'      => 'Aircraft',
          'ShortName' => 'A340-600',
          'LongName'  => 'Airbus A340-600',
          'Instruments' => [{
            'ShortName' => 'Short Name',
            'LongName'  => 'Long Name'
          }]
        }]
      )
    }
  end

  factory :collection_draft_invalid_picklists_instrument_children, class: CollectionDraft do
    draft_type { 'CollectionDraft' }
    native_id { 'invalid_picklists_draft_id' }
    provider_id { 'MMT_2' }
    draft {
      all_required_fields.merge(
        'Platforms' => [{
          'Type'      => 'Aircraft',
          'ShortName' => 'A340-600',
          'LongName'  => 'Airbus A340-600',
          'Instruments' => [{
            'ShortName' => 'ATM',
            'LongName'  => 'Airborne Topographic Mapper',
            'ComposedOf' => [{
              'ShortName' => 'Short Name',
              'LongName'  => 'Long Name'
            }]
          }]
        }]
      )
    }
  end

  factory :collection_invalid_ingest_error, class: CollectionDraft do
    draft_type { 'CollectionDraft' }
    native_id { 'invalid_ingest_draft_id' }
    provider_id { 'MMT_2' }
    draft {
      all_required_fields.merge(
        'SpatialExtent' => {
          'SpatialCoverageType' => 'HORIZONTAL',
          'HorizontalSpatialDomain' => {
            'Geometry' => {
              'CoordinateSystem' => 'CARTESIAN',
              'Points' => [
                {
                  'Longitude' => 0.0,
                  'Latitude' => 0.0
                }
              ]
            }
          },
          'GranuleSpatialRepresentation' => 'ORBIT'
        }
      )
    }
  end

  factory :collection_multiple_item_invalid_ingest_error, class: CollectionDraft do
    draft_type { 'CollectionDraft' }
    native_id { 'invalid_ingest_draft_id' }
    provider_id { 'MMT_2' }
    draft {
      all_required_fields.merge(
        'SpatialExtent' => {
          'SpatialCoverageType' => 'HORIZONTAL',
          'HorizontalSpatialDomain' => {
            'Geometry' => {
              'CoordinateSystem' => 'CARTESIAN',
              "GPolygons": [
                {
                  "Boundary": {
                    "Points": [
                      {
                        "Longitude": 1.0,
                        "Latitude": 1.0
                      },
                      {
                        "Longitude": 5.0,
                        "Latitude": 5.0
                      },
                      {
                        "Longitude": 1.0,
                        "Latitude": 5.0
                      },
                      {
                        "Longitude": 10.0,
                        "Latitude": 1.0
                      }
                    ]
                  }
                }
              ]
            }
          },
          'GranuleSpatialRepresentation' => 'ORBIT'
        }
      )
    }
  end
end

def all_required_fields
  {
    'Platforms' => [{
      'Type'      => 'Aircraft',
      'ShortName' => 'A340-600',
      'LongName'  => 'Airbus A340-600',
    }],
    'Abstract' => 'This is a long description of the collection',
    'ShortName' => '12345',
    'Version' => '1',
    'EntryTitle' => 'Required Fields Only Draft',
    'CollectionProgress' => 'ACTIVE',
    'DataCenters' => [{
      'Roles' => ['DISTRIBUTOR'],
      'ShortName' => 'AARHUS-HYDRO',
      'LongName' => 'Hydrogeophysics Group, Aarhus University ' # controlled keywords source has extra space at the end
    }],
    'ProcessingLevel' => {
      'Id' => '1A',
      'ProcessingLevelDescription' => 'Level 1 Description'
    },
    'ScienceKeywords' => [{
      'Category' => 'EARTH SCIENCE',
      'Topic' => 'ATMOSPHERE',
      'Term' => 'ATMOSPHERIC TEMPERATURE'
    }],
    'SpatialExtent' => {
      'GranuleSpatialRepresentation' => 'CARTESIAN'
    },
    'TemporalExtents' => [{
      'PrecisionOfSeconds' => 1,
      'EndsAtPresentFlag' => false,
      'SingleDateTimes' => ['2015-07-01T00:00:00Z', '2015-12-25T00:00:00Z']
    }]
  }
end
