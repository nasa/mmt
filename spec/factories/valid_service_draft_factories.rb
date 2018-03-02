FactoryGirl.define do
  factory :empty_service_draft, class: ServiceDraft do
    provider_id 'MMT_2'
    draft_type 'ServiceDraft'

    draft { {} }

    short_name nil
    entry_title nil
  end

  factory :invalid_service_draft, class: ServiceDraft do
    transient do
      draft_short_name nil
      draft_entry_title nil
    end

    provider_id 'MMT_2'
    draft_type 'ServiceDraft'

    draft {{
      'Name': draft_short_name || "#{Faker::HitchhikersGuideToTheGalaxy.location}_#{Faker::Number.number(20)}",
      'LongName': draft_entry_title || "#{Faker::HitchhikersGuideToTheGalaxy.marvin_quote} #{Faker::Number.number(120)}",
      'Type': 'INVALID',
      'Version': '1.12345678987654321012345',
      'Description': 1030.times { 's' },
      'ServiceKeywords': [
        {
          'ServiceCategory': 'EARTH SCIENCE SERVICES'
        }
      ],
      'ScienceKeywords': [
        {
          'Category': 'SPECTRAL/ENGINEERING',
          'Topic': 'INFRARED WAVELENGTHS'
        }
      ],
      'RelatedURL': {
        'Description': 'Test related url',
        'URLContentType': 'DistributionURL',
        'Type': 'GET SERVICE',
        'Subtype': 'SOFTWARE PACKAGE',
        'GetService': {
          'MimeType': 'application/json',
          'Protocol': 'HTTP',
          'FullName': 'Test Service',
          'DataID': 'Test data',
          'DataType': 'Test data type',
          'URI': ['Test URI 1', 'Test URI 2']
        }
      },
      'ServiceOrganizations': [
        {
          'ShortName': 'DOI/USGS/CMG/WHSC',
          'LongName': 'Woods Hole Science Center, Coastal and Marine Geology, U.S. Geological Survey, U.S. Department of the Interior'
        }
      ],
      'Platforms': [
        {
          'ShortName': 81.times { 'a' }
        }
      ],
      'ServiceQuality': {
        # conditionally requires 'QualityFlag'
        'Traceability': 'some quality metric'
      },
      'Coverage': {
        'CoverageSpatialExtent': {
          'Uuid': '!@#$%%^&*',# bad uuid pattern
          'SpatialPolygons': [
            # requires 3 points
            {
              'Latitude': 42.137551,
              'Longitude': 50.343391
            },
            {
              'Latitude': 44.054954,
              'Longitude': 33.333144
            }
          ],
          'SpatialLineStrings': [
            {
              # requires start and end
              'StartPoint': {
                'Latitude': 42.137551,
                'Longitude': 50.343391
              }
            }
          ],
          'SpatialBoundingBox': {
            # requires 4 points
            'MinX': 33.333144,
            'MinY': 42.137551
          }
        },
        'CoverageTemporalExtent': {
          'Uuid': '!@#$%^^&*()',# bad uuid pattern
        }
      },
      'ServiceOptions': {
        'SubsetTypes': ['BadType']
      },
      'AncillaryKeywords': Array.wrap(1030.times { 'k' }),
      'AccessConstraints': Array.wrap(1030.times { 'c' }),
      'UseConstraints': Array.wrap(1030.times { 't' }),
      'ContactGroups': [
        {
          'GroupName': 'Missing Roles'
        }
      ],
      'ContactPersons': [
        {
          'FirstName': 'Missing Roles'
        }
      ]
    }}

    short_name nil
    entry_title nil
  end

  factory :full_service_draft, class: ServiceDraft do
    transient do
      draft_short_name nil
      draft_entry_title nil
    end

    native_id 'full_service_draft_native_id'
    provider_id 'MMT_2'
    draft_type 'ServiceDraft'

    draft {{
      'Name': draft_short_name || "#{Faker::HitchhikersGuideToTheGalaxy.location.truncate(10, omission: '')}_#{Faker::Number.number(9)}",
      'LongName': draft_entry_title || "#{Faker::HitchhikersGuideToTheGalaxy.marvin_quote} #{Faker::Number.number(6)}".truncate(120),
      'Type': 'NOT PROVIDED',
      'Version': '1.0',
      'Description': 'Description of the test service',
      'RelatedURL': {
        'Description': 'Test related url',
        'URLContentType': 'DistributionURL',
        'Type': 'GET SERVICE',
        'Subtype': 'SOFTWARE PACKAGE',
        'URL': 'nasa.gov',
        'GetService': {
          'MimeType': 'application/json',
          'Protocol': 'HTTP',
          'FullName': 'Test Service',
          'DataID': 'Test data',
          'DataType': 'Test data type',
          'URI': ['Test URI 1', 'Test URI 2']
        }
      },
      'OnlineAccessURLPatternMatch': 'Online Access URL Pattern Match',
      'OnlineAccessURLPatternSubstitution': 'Online Access URL Pattern Substitution',
      'ServiceQuality': {
        'QualityFlag': 'Reviewed',
        'Traceability': 'traceability',
        'Lineage': 'lineage'
      },
      'AccessConstraints': ['access constraint 1', 'access constraint 2'],
      'UseConstraints': ['use constraint 1', 'use constraint 2'],
      'ServiceKeywords': [
        {
          'ServiceCategory': 'EARTH SCIENCE SERVICES',
          'ServiceTopic': 'DATA ANALYSIS AND VISUALIZATION',
          'ServiceTerm': 'GEOGRAPHIC INFORMATION SYSTEMS',
          'ServiceSpecificTerm': 'DESKTOP GEOGRAPHIC INFORMATION SYSTEMS'
        }
      ],
      'ScienceKeywords': [
        {
          'Category': 'EARTH SCIENCE',
          'Topic': 'SOLID EARTH',
          'Term': 'ROCKS/MINERALS/CRYSTALS',
          'VariableLevel1': 'SEDIMENTARY ROCKS',
          'VariableLevel2': 'SEDIMENTARY ROCK PHYSICAL/OPTICAL PROPERTIES',
          'VariableLevel3': 'LUMINESCENCE'
        }
      ],
      'AncillaryKeywords': ['Ancillary keyword 1', 'Ancillary keyword 2'],
      'ServiceOrganizations': [
        {
          'Roles': ['DEVELOPER', 'PUBLISHER'],
          'ShortName': 'AARHUS-HYDRO',
          'LongName': 'Hydrogeophysics Group, Aarhus University ',
          'Uuid': '7b1ac64e-8bdd-45db-831b-994b13f60100',
          'ContactGroups': [
            {
              'Roles': ['SCIENCE CONTACT', 'TECHNICAL CONTACT'],
              'GroupName': 'Group 1',
              'Uuid': 'b1837851-91b3-4aa9-8e89-f805fae629c9',
              'NonServiceOrganizationAffiliation': 'NonServiceOrganizationAffiliation Group 1',
              'ContactInformation': {
                'ServiceHours': '9-6, M-F',
                'ContactInstruction': 'Email only',
                'ContactMechanisms': [
                  {
                    'Type': 'Email',
                    'Value': 'example@example.com'
                  }, {
                    'Type': 'Email',
                    'Value': 'example2@example.com'
                  }
                ],
                'Addresses': [
                  {
                    'StreetAddresses': ['300 E Street Southwest', 'Room 203', 'Address line 3'],
                    'City': 'Washington',
                    'StateProvince': 'DC',
                    'PostalCode': '20546',
                    'Country': 'United States'
                  },
                  {
                    'StreetAddresses': ['8800 Greenbelt Road'],
                    'City': 'Greenbelt',
                    'StateProvince': 'MD',
                    'PostalCode': '20771',
                    'Country': 'United States'
                  }
                ],
                'RelatedUrls': [
                  {
                    'Description': 'Related URL 1 Description',
                    'URLContentType': 'CollectionURL',
                    'Type': 'DATA SET LANDING PAGE',
                    'URL': 'http://example.com/'
                  },
                  {
                    'Description': 'Related URL 2 Description',
                    'URLContentType': 'DistributionURL',
                    'Type': 'GET SERVICE',
                    'Subtype': 'DIF',
                    'URL': 'https://example.com/',
                    'GetService': {
                      'MimeType': 'Not provided',
                      'Protocol': 'HTTPS',
                      'FullName': 'Service Name',
                      'DataID': 'data_id',
                      'DataType': 'data type',
                      'URI': ['uri1', 'uri2']
                    }
                  },
                  {
                    'Description': 'Related URL 3 Description',
                    'URLContentType': 'DistributionURL',
                    'Type': 'GET DATA',
                    'Subtype': 'EARTHDATA SEARCH',
                    'URL': 'https://search.earthdata.nasa.gov/',
                    'GetData': {
                      'Format': 'ascii',
                      'Size': 42.0,
                      'Unit': 'KB',
                      'Fees': '0',
                      'Checksum': 'sdfgfgksghafgsdvbasf'
                    }
                  }
                ]
              }
            },
            {
              'Roles': ['SERVICE PROVIDER CONTACT'],
              'GroupName': 'Group 2'
            }
          ],
          'ContactPersons': [
            {
              'Roles': ['SERVICE PROVIDER'],
              'FirstName': 'First',
              'MiddleName': 'Middle',
              'LastName': 'Last',
              'Uuid': '39092bbc-97ec-41c3-ab85-e3e8cacf429a',
              'NonServiceOrganizationAffiliation': 'NonServiceOrganizationAffiliation Person 1',
              'ContactInformation': {
                'ServiceHours': '9-6, M-F',
                'ContactInstruction': 'Email only',
                'ContactMechanisms': [
                  {
                    'Type': 'Email',
                    'Value': 'example@example.com'
                  }, {
                    'Type': 'Email',
                    'Value': 'example2@example.com'
                  }
                ],
                'Addresses': [
                  {
                    'StreetAddresses': ['300 E Street Southwest', 'Room 203', 'Address line 3'],
                    'City': 'Washington',
                    'StateProvince': 'DC',
                    'PostalCode': '20546',
                    'Country': 'United States'
                  },
                  {
                    'StreetAddresses': ['8800 Greenbelt Road'],
                    'City': 'Greenbelt',
                    'StateProvince': 'MD',
                    'PostalCode': '20771',
                    'Country': 'United States'
                  }
                ],
                'RelatedUrls': [
                  {
                    'Description': 'Related URL 1 Description',
                    'URLContentType': 'CollectionURL',
                    'Type': 'DATA SET LANDING PAGE',
                    'URL': 'http://example.com/'
                  },
                  {
                    'Description': 'Related URL 2 Description',
                    'URLContentType': 'DistributionURL',
                    'Type': 'GET SERVICE',
                    'Subtype': 'DIF',
                    'URL': 'https://example.com/',
                    'GetService': {
                      'MimeType': 'Not provided',
                      'Protocol': 'HTTPS',
                      'FullName': 'Service Name',
                      'DataID': 'data_id',
                      'DataType': 'data type',
                      'URI': ['uri1', 'uri2']
                    }
                  },
                  {
                    'Description': 'Related URL 3 Description',
                    'URLContentType': 'DistributionURL',
                    'Type': 'GET DATA',
                    'Subtype': 'EARTHDATA SEARCH',
                    'URL': 'https://search.earthdata.nasa.gov/',
                    'GetData': {
                      'Format': 'ascii',
                      'Size': 42.0,
                      'Unit': 'KB',
                      'Fees': '0',
                      'Checksum': 'sdfgfgksghafgsdvbasf'
                    }
                  }
                ]
              }
            },
            {
              'Roles': ['DEVELOPER'],
              'LastName': 'Last 2'
            }
          ],
          'ContactInformation': {
            'ServiceHours': '9-6, M-F',
            'ContactInstruction': 'Email only',
            'ContactMechanisms': [
              {
                'Type': 'Email',
                'Value': 'example@example.com'
              }, {
                'Type': 'Email',
                'Value': 'example2@example.com'
              }
            ],
            'Addresses': [
              {
                'StreetAddresses': ['300 E Street Southwest', 'Room 203', 'Address line 3'],
                'City': 'Washington',
                'StateProvince': 'DC',
                'PostalCode': '20546',
                'Country': 'United States'
              },
              {
                'StreetAddresses': ['8800 Greenbelt Road'],
                'City': 'Greenbelt',
                'StateProvince': 'MD',
                'PostalCode': '20771',
                'Country': 'United States'
              }
            ],
            'RelatedUrls': [
              {
                'Description': 'Related URL 1 Description',
                'URLContentType': 'CollectionURL',
                'Type': 'DATA SET LANDING PAGE',
                'URL': 'http://example.com/'
              },
              {
                'Description': 'Related URL 2 Description',
                'URLContentType': 'DistributionURL',
                'Type': 'GET SERVICE',
                'Subtype': 'DIF',
                'URL': 'https://example.com/',
                'GetService': {
                  'MimeType': 'Not provided',
                  'Protocol': 'HTTPS',
                  'FullName': 'Service Name',
                  'DataID': 'data_id',
                  'DataType': 'data type',
                  'URI': ['uri1', 'uri2']
                }
              },
              {
                'Description': 'Related URL 3 Description',
                'URLContentType': 'DistributionURL',
                'Type': 'GET DATA',
                'Subtype': 'EARTHDATA SEARCH',
                'URL': 'https://search.earthdata.nasa.gov/',
                'GetData': {
                  'Format': 'ascii',
                  'Size': 42.0,
                  'Unit': 'KB',
                  'Fees': '0',
                  'Checksum': 'sdfgfgksghafgsdvbasf'
                }
              }
            ]
          }
        }
      ],
      'ContactGroups': [
        {
          'Roles': ['SCIENCE CONTACT', 'TECHNICAL CONTACT'],
          'GroupName': 'Group 1',
          'Uuid': 'b1837851-91b3-4aa9-8e89-f805fae629c9',
          'NonServiceOrganizationAffiliation': 'NonServiceOrganizationAffiliation Group 1',
          'ContactInformation': {
            'ServiceHours': '9-6, M-F',
            'ContactInstruction': 'Email only',
            'ContactMechanisms': [
              {
                'Type': 'Email',
                'Value': 'example@example.com'
              }, {
                'Type': 'Email',
                'Value': 'example2@example.com'
              }
            ],
            'Addresses': [
              {
                'StreetAddresses': ['300 E Street Southwest', 'Room 203', 'Address line 3'],
                'City': 'Washington',
                'StateProvince': 'DC',
                'PostalCode': '20546',
                'Country': 'United States'
              },
              {
                'StreetAddresses': ['8800 Greenbelt Road'],
                'City': 'Greenbelt',
                'StateProvince': 'MD',
                'PostalCode': '20771',
                'Country': 'United States'
              }
            ],
            'RelatedUrls': [
              {
                'Description': 'Related URL 1 Description',
                'URLContentType': 'CollectionURL',
                'Type': 'DATA SET LANDING PAGE',
                'URL': 'http://example.com/'
              },
              {
                'Description': 'Related URL 2 Description',
                'URLContentType': 'DistributionURL',
                'Type': 'GET SERVICE',
                'Subtype': 'DIF',
                'URL': 'https://example.com/',
                'GetService': {
                  'MimeType': 'Not provided',
                  'Protocol': 'HTTPS',
                  'FullName': 'Service Name',
                  'DataID': 'data_id',
                  'DataType': 'data type',
                  'URI': ['uri1', 'uri2']
                }
              },
              {
                'Description': 'Related URL 3 Description',
                'URLContentType': 'DistributionURL',
                'Type': 'GET DATA',
                'Subtype': 'EARTHDATA SEARCH',
                'URL': 'https://search.earthdata.nasa.gov/',
                'GetData': {
                  'Format': 'ascii',
                  'Size': 42.0,
                  'Unit': 'KB',
                  'Fees': '0',
                  'Checksum': 'sdfgfgksghafgsdvbasf'
                }
              }
            ]
          }
        },
        {
          'Roles': ['SERVICE PROVIDER CONTACT'],
          'GroupName': 'Group 2'
        }
      ],
      'ContactPersons': [
        {
          'Roles': ['SERVICE PROVIDER'],
          'FirstName': 'First',
          'MiddleName': 'Middle',
          'LastName': 'Last',
          'Uuid': '39092bbc-97ec-41c3-ab85-e3e8cacf429a',
          'NonServiceOrganizationAffiliation': 'NonServiceOrganizationAffiliation Person 1',
          'ContactInformation': {
            'ServiceHours': '9-6, M-F',
            'ContactInstruction': 'Email only',
            'ContactMechanisms': [
              {
                'Type': 'Email',
                'Value': 'example@example.com'
              }, {
                'Type': 'Email',
                'Value': 'example2@example.com'
              }
            ],
            'Addresses': [
              {
                'StreetAddresses': ['300 E Street Southwest', 'Room 203', 'Address line 3'],
                'City': 'Washington',
                'StateProvince': 'DC',
                'PostalCode': '20546',
                'Country': 'United States'
              },
              {
                'StreetAddresses': ['8800 Greenbelt Road'],
                'City': 'Greenbelt',
                'StateProvince': 'MD',
                'PostalCode': '20771',
                'Country': 'United States'
              }
            ],
            'RelatedUrls': [
              {
                'Description': 'Related URL 1 Description',
                'URLContentType': 'CollectionURL',
                'Type': 'DATA SET LANDING PAGE',
                'URL': 'http://example.com/'
              },
              {
                'Description': 'Related URL 2 Description',
                'URLContentType': 'DistributionURL',
                'Type': 'GET SERVICE',
                'Subtype': 'DIF',
                'URL': 'https://example.com/',
                'GetService': {
                  'MimeType': 'Not provided',
                  'Protocol': 'HTTPS',
                  'FullName': 'Service Name',
                  'DataID': 'data_id',
                  'DataType': 'data type',
                  'URI': ['uri1', 'uri2']
                }
              },
              {
                'Description': 'Related URL 3 Description',
                'URLContentType': 'DistributionURL',
                'Type': 'GET DATA',
                'Subtype': 'EARTHDATA SEARCH',
                'URL': 'https://search.earthdata.nasa.gov/',
                'GetData': {
                  'Format': 'ascii',
                  'Size': 42.0,
                  'Unit': 'KB',
                  'Fees': '0',
                  'Checksum': 'sdfgfgksghafgsdvbasf'
                }
              }
            ]
          }
        },
        {
          'Roles': ['DEVELOPER'],
          'LastName': 'Last 2'
        }
      ],
      'Platforms': [
        {
          'ShortName': 'A340-600',
          'LongName': 'Airbus A340-600',
          'Instruments': [
            {
              'ShortName': 'ATM',
              'LongName': 'Airborne Topographic Mapper'
            },
            {
              'ShortName': 'LVIS',
              'LongName': 'Land, Vegetation, and Ice Sensor'
            }
          ]
        },
        {
          'ShortName': 'DMSP 5B/F3',
          'LongName': 'Defense Meteorological Satellite Program-F3',
          'Instruments': [
            {
              'ShortName': 'ACOUSTIC SOUNDERS'
            }
          ]
        }
      ],
      'Coverage': {
        'Name': 'Coverage Name',
        'CoverageSpatialExtent': {
          'Type': 'SPATIAL_POINT',
          'Uuid': '13f5e348-ffad-4ef9-9600-12ad74f60f77',
          'SpatialPoints': [
            {
              'Latitude': 0.0,
              'Longitude': 0.0
            },
            {
              'Latitude': 50.0,
              'Longitude': 50.0
            }
          ]
        },
        'SpatialResolution': '50',
        'SpatialResolutionUnit': 'KM',
        'CoverageTemporalExtent': {
          'CoverageTimePoints': [
            {
              'TimeFormat': 'format 1',
              'TimeValue': 'value 1',
              'Description': 'description 1'
            },
            {
              'TimeFormat': 'format 2',
              'TimeValue': 'value 2',
              'Description': 'description 2'
            }
          ],
          'Uuid': '17abd5ea-fd95-4801-a9e4-0ccd2f7acf40'
        },
        'TemporalResolution': '7',
        'TemporalResolutionUnit': 'days',
        'RelativePath': 'relative path'
      },
      'ServiceOptions': {
        'SubsetTypes': ['Spatial'],
        'SupportedProjections': ['Geographic'],
        'InterpolationTypes': ['Bicubic Interpolation', 'Bilinear Interpolation'],
        'SupportedFormats': ['HDF-EOS4', 'HDF-EOS5']
      }
    }}
  end
end
