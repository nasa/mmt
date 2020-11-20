FactoryBot.define do
  factory :empty_service_draft, class: ServiceDraft do
    provider_id { 'MMT_2' }
    draft_type { 'ServiceDraft' }

    draft { {} }

    short_name { nil }
    entry_title { nil }
  end

  factory :invalid_service_draft, class: ServiceDraft do
    transient do
      draft_short_name { nil }
      draft_entry_title { nil }
    end

    provider_id { 'MMT_2' }
    draft_type { 'ServiceDraft' }

    # The goal is to make the progress circles turn red. In some cases this
    # means entering data that is too long (e.g. description). Enum fields (e.g.
    # Type) have invalid values. Service Keywords are too short. Fields like URL
    # are missing required fields.
    draft {{
      'Name': draft_short_name || "#{Faker::Movies::HitchhikersGuideToTheGalaxy.location}_#{Faker::Number.number(digits: 90)}",
      'LongName': draft_entry_title || "#{Faker::Movies::HitchhikersGuideToTheGalaxy.quote.truncate(1000, omission: '')}_#{Faker::Number.number(digits: 1100)}",
      'Type': 'INVALID',
      'Version': '1.12345678987654321012345',
      'Description': 1030.times { 's' },
      'URL': {
        'Description': 'Needs a URL'
      },
      'ServiceKeywords': [
        {
          'ServiceCategory': 'EARTH SCIENCE SERVICES'
        }
      ],
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
      'OperationMetadata': {
        'OperationName': 'BadOperationMetadataName',
        'DistributedComputingPlatform': ['BADCOMPUTINGPLATFORM']
      },
      'ServiceOptions': {
        'SubsetTypes': ['BadType']
      },
      'AncillaryKeywords': Array.wrap(1030.times { 'k' }),
      'AccessConstraints': Array.wrap(1030.times { 'c' }),
      'UseConstraints': {
        'LicenseURL': Array.wrap(1030.times { 'c' })
      },
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

    short_name { nil }
    entry_title { nil }
  end

  factory :full_service_draft, class: ServiceDraft do
    transient do
      draft_short_name { nil }
      draft_entry_title { nil }
    end

    native_id { 'full_service_draft_native_id' }
    provider_id { 'MMT_2' }
    draft_type { 'ServiceDraft' }

    draft do
      {
        'Name': draft_short_name || "#{Faker::Movies::HitchhikersGuideToTheGalaxy.location.truncate(10, omission: '')}_#{Faker::Number.number(digits: 9)}",
        'LongName': draft_entry_title || "#{Faker::Movies::HitchhikersGuideToTheGalaxy.quote.truncate(100, omission: '')}_#{Faker::Number.number(digits: 19)}",
        'Type': 'NOT PROVIDED',
        'Version': '1.0',
        'VersionDescription': 'Description of the Current Version',
        'LastUpdatedDate': '2020-05-20T00:00:00.000Z',
        'Description': 'Description of the test service',
        'URL': {
          'Description': 'Description of primary url',
          'URLValue': 'httpx://testurl.earthdata.nasa.gov'
        },
        'ServiceQuality': {
          'QualityFlag': 'Reviewed',
          'Traceability': 'traceability',
          'Lineage': 'lineage'
        },
        'AccessConstraints': 'access constraint 1',
        'UseConstraints': {
          'LicenseURL': 'LicenseUrl Text',
          'LicenseText': 'LicenseText Text'
        },
        'ServiceKeywords': [
          {
            'ServiceCategory': 'EARTH SCIENCE SERVICES',
            'ServiceTopic': 'DATA ANALYSIS AND VISUALIZATION',
            'ServiceTerm': 'GEOGRAPHIC INFORMATION SYSTEMS',
            'ServiceSpecificTerm': 'DESKTOP GEOGRAPHIC INFORMATION SYSTEMS'
          }
        ],
        'AncillaryKeywords': ['Ancillary keyword 1', 'Ancillary keyword 2'],
        'ServiceOrganizations': [
          {
            'Roles': ['DEVELOPER', 'PUBLISHER'],
            'ShortName': 'AARHUS-HYDRO',
            'LongName': 'Hydrogeophysics Group, Aarhus University ',
          },
          {
            'Roles': ['DEVELOPER', 'PUBLISHER'],
            'ShortName': 'AARHUS-HYDRO',
            'LongName': 'Hydrogeophysics Group, Aarhus University ',
            'OnlineResource': {
              'Name': 'ORN Text',
              'Protocol': 'ORP Text',
              'Linkage': 'ORL Text',
              'Description': 'ORD Text',
              'ApplicationProfile': 'ORAP Text',
              'Function': 'ORF Text'
            }
          },
        ],
        'ContactGroups': [
          {
            'Roles': ['SCIENCE CONTACT', 'TECHNICAL CONTACT'],
            'GroupName': 'Group 1',
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
              'OnlineResources': [
                {
                  'Name': 'ORN1 Text',
                  'Linkage': 'ORL1 Text',
                  'Description': 'ORD1 Text',
                  'Protocol': 'ORP1 Text',
                  'ApplicationProfile': 'ORAP1 Text',
                  'Function': 'ORF1 Text'
                },
                {
                  'Name': 'ORN2 Text',
                  'Linkage': 'ORL2 Text',
                  'Description': 'ORD2 Text',
                  'Protocol': 'ORP2 Text',
                  'ApplicationProfile': 'ORAP2 Text',
                  'Function': 'ORF2 Text'
                },
                {
                  'Name': 'ORN3 Text',
                  'Linkage': 'ORL3 Text',
                  'Description': 'ORD3 Text',
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
              'OnlineResources': [
                {
                  'Name': 'ORN1 Text',
                  'Linkage': 'ORL1 Text',
                  'Description': 'ORD1 Text',
                  'Protocol': 'ORP1 Text',
                  'ApplicationProfile': 'ORAP1 Text',
                  'Function': 'ORF1 Text'
                },
                {
                  'Name': 'ORN2 Text',
                  'Linkage': 'ORL2 Text',
                  'Description': 'ORD2 Text',
                  'Protocol': 'ORP2 Text',
                  'ApplicationProfile': 'ORAP2 Text',
                  'Function': 'ORF2 Text'
                },
                {
                  'Name': 'ORN3 Text',
                  'Linkage': 'ORL3 Text',
                  'Description': 'ORD3 Text',
                }
              ]
            }
          },
          {
            'Roles': ['DEVELOPER'],
            'LastName': 'Last 2'
          }
        ],
        'OperationMetadata': [
          {
            'OperationName': 'DescribeCoverage',
            'OperationDescription': 'The DescribeCoverage operation description...',
            'DistributedComputingPlatform': ['WEBSERVICES', 'XML'],
            'InvocationName': 'SOME DAAC WCS Server',
            'ConnectPoint': {
              'ResourceName': '1286_2',
              'ResourceLinkage': 'https://webmap.some.gov/cgi-bin/mapserv?coverage=1286_2&request=DescribeCoverage&service=WCS&version=1.0.0',
              'ResourceDescription': 'Vegetation classes mapped to LIDAR-derived canopy structure classes in 30-meter, Great Smoky Mountains National Park, 2011'
            },
            'OperationChainedMetadata': {
              'OperationChainName': 'Some Op Chain for Smoky Mountains',
              'OperationChainDescription': 'Some Op Chain description for Smoky Mountains 30-meter 2011'
            },
            'CoupledResource': {
              'ScopedName': '1286_2',
              'DataResourceDOI': 'https://doi.org/10.3334/SOMEDAAC/1286',
              'DataResource': {
                'DataResourceIdentifier': 'GreatSmokyMountainsNationalPark',
                'DataResourceSourceType': 'Map',
                'DataResourceSpatialType': 'GENERAL_GRID',
                'DataResourceSpatialExtent': {
                  'GeneralGrid': {
                    'CRSIdentifier': 'EPSG:26917',
                    'Axis': [
                      {
                        'AxisLabel': 'x',
                        'GridResolution': 30.0,
                        'Extent':
                          {
                            'ExtentLabel': 'axis 1 extent label',
                            'LowerBound': 0.0,
                            'UpperBound': 2918.0,
                            'UOMLabel': 'Meters'
                          }
                      },
                      {
                        'AxisLabel': 'y',
                        'GridResolution': 30.0,
                        'Extent':
                          {
                            'ExtentLabel': 'axis 2 extent label',
                            'LowerBound': 0.0,
                            'UpperBound': 1340.0,
                            'UOMLabel': 'Meters'
                          }
                      }
                    ]
                  }
                },
                'SpatialResolution': 30.0,
                'SpatialResolutionUnit': 'Meters',
                'DataResourceTemporalType': 'TIME_STAMP',
                'DataResourceTemporalExtent': {
                  'DataResourceTimePoints': [
                    {
                      'TimeFormat': '%Y%M%D',
                      'TimeValue': '2009-01-08',
                      'Description': 'Time stamp of the granule within the collection'
                    },
                    {
                      'TimeFormat': '%Y',
                      'TimeValue': '2011',
                      'Description': 'Time stamp of the layer'
                    }
                  ]
                },
                'TemporalResolution': 1.0,
                'TemporalResolutionUnit': 'YEAR',
                'RelativePath': '/cgi-bin/mapserv?coverage=1286_2&request=DescribeCoverage&service=WCS&version=1.0.0'
              },
              'CouplingType': 'MIXED'
            },
            'Parameters': [
              {
                'ParameterName': 'parameter 1',
                'ParameterDescription': 'parameter 1 description',
                'ParameterDirection': 'abc direction',
                'ParameterOptionality': 'optional',
                'ParameterRepeatability': 'some'
              },
              {
                'ParameterName': 'parameter 2',
                'ParameterDescription': 'parameter 2 description',
                'ParameterDirection': 'xyz direction',
                'ParameterOptionality': 'optional',
                'ParameterRepeatability': 'some'
              }
            ]
          }
        ],
        'ServiceOptions': {
          'Subset': {
            'SpatialSubset': {
              'Point': {
                'AllowMultipleValues': false
              },
              'Polygon': {
                'MaximumNumberOfPoints': 20.0,
                'AllowMultipleValues': true
              },
              'Shapefile': [
                {
                  'Format': 'ESRI',
                  'MaximumFileSizeInBytes': 400.0
                },
                {
                  'Format': 'GeoJSON'
                }
              ]
            },
            'VariableSubset': {
              'AllowMultipleValues': true
            }
          },
          'VariableAggregationSupportedMethods': ['ANOMOLY'],
          'SupportedInputProjections': [
            {
              'ProjectionName': 'Geographic',
              'ProjectionLatitudeOfCenter': 10.0,
              'ProjectionLongitudeOfCenter': 10.0,
              'ProjectionFalseEasting': 10.0,
              'ProjectionFalseNorthing': 10.0,
              'ProjectionAuthority': '4326',
              'ProjectionUnit': 'Degrees',
              'ProjectionDatumName': 'World Geodetic System (WGS) 1984'
            }
          ],
          'SupportedOutputProjections': [
            {
              'ProjectionName': 'Geographic',
              'ProjectionLatitudeOfCenter': 10.0,
              'ProjectionLongitudeOfCenter': 10.0,
              'ProjectionFalseEasting': 10.0,
              'ProjectionFalseNorthing': 10.0,
              'ProjectionAuthority': '4326',
              'ProjectionUnit': 'Degrees',
              'ProjectionDatumName': 'World Geodetic System (WGS) 1984'
            },
            {
              'ProjectionName': 'NAD83 / UTM zone 17N',
              'ProjectionLatitudeOfCenter': 10.0,
              'ProjectionLongitudeOfCenter': 10.0,
              'ProjectionFalseEasting': 10.0,
              'ProjectionFalseNorthing': 10.0,
              'ProjectionAuthority': '26917',
              'ProjectionUnit': 'Meters',
              'ProjectionDatumName': 'North American Datum (NAD) 1983'
            }
          ],
          'InterpolationTypes': ['Bicubic Interpolation', 'Bilinear Interpolation'],
          'SupportedReformattings': [
            {
              'SupportedInputFormat': 'HDF-EOS2',
              'SupportedOutputFormats': ['HDF-EOS5']
            },
            {
              'SupportedInputFormat': 'HDF-EOS2',
              'SupportedOutputFormats': ['HDF-EOS2', 'HDF-EOS']
            }
          ],
          'MaxGranules': 50.0
        }
      }
    end
  end
end
