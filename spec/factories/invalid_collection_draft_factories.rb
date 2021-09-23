FactoryBot.define do
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
          'Type' => 'USE SERVICE API',
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
            'Unit' => 'badunit',
            'Format' => 'badformat'
          }
        }, {
          'URLContentType' => 'CollectionURL',
          'Type' => 'badurltype'
        }, {
          'URLContentType' => 'PublicationURL',
          'Type' => 'VIEW RELATED INFORMATION',
          'Subtype' => 'badurlsubtype'
        }],
        'DataLanguage' => 'english',
        'MetadataLanguage' => 'english',
        'Platforms' => [{
          'Type' => 'Aircraft',
          'ShortName' => 'test 1 P ShortName',
          'LongName' => 'test 1 P LongName'
        }],
        'Projects' => [{
          'ShortName' => 'project shortname test',
          'LongName' => 'project longname test'
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
            }],
            'RelatedUrls' => [{
              'URLContentType' => 'badcontenttype'
            }, {
              'URLContentType' => 'DataCenterURL',
              'Type' => 'badurltype'
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
              }],
              'RelatedUrls' => [{
                'URLContentType' => 'badcontenttype'
              }, {
                'URLContentType' => 'DataContactURL',
                'Type' => 'badurltype'
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
              }],
              'RelatedUrls' => [{
                'URLContentType' => 'badcontenttype'
              }, {
                'URLContentType' => 'DataContactURL',
                'Type' => 'badurltype'
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
            }],
            'RelatedUrls' => [{
              'URLContentType' => 'badcontenttype'
            }, {
              'URLContentType' => 'DataContactURL',
              'Type' => 'badurltype'
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
            }],
            'RelatedUrls' => [{
              'URLContentType' => 'badcontenttype'
            }, {
              'URLContentType' => 'DataContactURL',
              'Type' => 'badurltype'
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
                },
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
          'GranuleSpatialRepresentation' => 'CARTESIAN'
        }
      )
    }
  end
end
