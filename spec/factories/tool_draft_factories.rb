FactoryBot.define do
  factory :empty_tool_draft, class: ToolDraft do
    provider_id { 'MMT_2' }
    draft_type { 'ToolDraft' }

    draft { {} }

    short_name { nil }
    entry_title { nil }
  end

  factory :invalid_tool_draft, class: ToolDraft do
    transient do
      draft_short_name { nil }
      draft_entry_title { nil }
    end

    provider_id { 'MMT_2' }
    draft_type { 'ToolDraft' }

    # To make the fields Invalid, most of the string fields had to be given
    # data with a length greater than the schema allows
    # other fields (URL, Related URL, Organizations, Contacts, Quality) had
    # multiple required/conditionally required subfields and were left incomplete
    # fields with enums (Formats, URL, Related URL) can be given data not in the enum
    # Tool Keywords has fewer than the required hierarcy levels
    draft do
      {
        'Name': draft_short_name || Faker::Lorem.characters(number: 95),
        'LongName': draft_short_name || Faker::Lorem.characters(number: 1050),
        'Type': 'INVALID',
        'Version': "#{Faker::Number.number(digits: 25)}",
        'VersionDescription': Faker::Lorem.characters(number: 1050),
        'LastUpdatedDate': 'abcdefg',
        'Description': Faker::Lorem.characters(number: 1050),
        'DOI': Faker::Lorem.characters(number: 1050),
        'URL': {
          'URLContentType': 'INVALID',
          'Type': 'INVALID'
        },
        'RelatedURLs': [
          {
            'Description': 'Test related url',
            'URLContentType': 'DistributionURL',
            'Type': 'GET SERVICE',
            'Subtype': 'SOFTWARE PACKAGE'
          }
        ],
        'SupportedInputFormats': ['BlackThroatedGreen'],
        'SupportedOutputFormats': ['YellowWarbler'],
        'SupportedOperatingSystems': [
          {
            'OperatingSystemVersion': 10.times { 'Puppy Linux' }
          }
        ],
        'SupportedBrowsers': [
          {
            'BrowserVersion': 18.times { 'Retawq' }
          }
        ],
        'SupportedSoftwareLanguages': [
          {
            'SoftwareLanguageVersion': 15.times { 'Chicken' }
          }
        ],
        'Quality': {
          'Traceability': 'traceability'
        },
        'AccessConstraints': Faker::Lorem.characters(number: 4040),
        'UseConstraints': {
          'LicenseURL': Faker::Lorem.characters(number: 1040)
        },
        'ToolKeywords': [
          {
            'ToolCategory': 'EARTH SCIENCE SERVICES'
          }
        ],
        'AncillaryKeywords': Array.wrap(Faker::Lorem.characters(number: 1040)),
        'Organizations': [
          {
            'ShortName': 'DOI/USGS/CMG/WHSC',
            'LongName': 'Woods Hole Science Center, Coastal and Marine Geology, U.S. Geological Survey, U.S. Department of the Interior'
          }
        ],
        'ContactGroups': [
          {
            'GroupName': 'Missing Roles'
          }
        ],
        'ContactPersons': [
          {
            'FirstName': 'Missing Roles'
          }
        ],
        'PotentialAction': {
          'Target': {
            'Type': 'EntryPoint',
            'ResponseContentType': ['text/html'],
            'UrlTemplate': 'https://podaac-tools.jpl.nasa.gov/soto/#b=BlueMarble_ShadedRelief_Bathymetry&l={+layers}&ve={+bbox}&d={+date}',
            "Description": 'the description',
            'HttpMethod': [
              'GET'
            ]
          },
          'QueryInput': [
            {
              "ValueName": 'layers',
              "Description": 'query input description for layers param',
              'ValueRequired': true,
              'ValueType': 'the query input value type'
            },
            {
              "ValueName": 'date',
              "Description": 'query input description for date param',
              'ValueRequired': false,
              'ValueType': 'the query input value type'
            },
            {
              "ValueName": 'bbox',
              "Description": 'query input description for bbox param',
              'ValueRequired': false,
              'ValueType': 'the query input value type'
            }
          ]
        }
      }
    end
  end

  factory :full_tool_draft, class: ToolDraft do
    transient do
      draft_short_name { nil }
      draft_entry_title { nil }
    end

    native_id { 'full_tool_draft_native_id' }
    provider_id { 'MMT_2' }
    draft_type { 'ToolDraft' }

    draft do
      {
        'Name': draft_short_name || "#{Faker::Games::Zelda.item}_#{Faker::Number.number(digits: 8)}",
        'LongName': draft_entry_title || "#{Faker::Movies::HarryPotter.quote}_#{Faker::Number.number(digits: 8)}",
        'Version': '1.0',
        'VersionDescription': 'Description of the version of the tool.',
        'Type': 'Downloadable Tool',
        'LastUpdatedDate': '2020-05-01T00:00:00Z',
        'Description': 'Description of the factory made tool.',
        'DOI': 'https://doi.org/10.1234/SOMEDAAC/5678',
        'URL': {
          'Description': 'Access the WRS-2 Path/Row to Latitude/Longitude Converter.',
          'URLContentType': 'DistributionURL',
          'Type': 'DOWNLOAD SOFTWARE',
          'Subtype': 'MOBILE APP',
          'URLValue': 'http://www.scp.byu.edu/software/slice_response/Xshape_temp.html'
        },
        'RelatedURLs': [
          {
            'Description': 'Test related url',
            'URLContentType': 'VisualizationURL',
            'Type': 'GET RELATED VISUALIZATION',
            'Subtype': 'MAP',
            'URL': 'nasa.gov'
          },
          {
            'Description': 'Test another related url',
            'URLContentType': 'PublicationURL',
            'Type': 'VIEW RELATED INFORMATION',
            'Subtype': 'ALGORITHM DOCUMENTATION',
            'URL': 'algorithms.org'
          }
        ],
        'SupportedInputFormats': ['GEOTIFFFLOAT32', 'ICARTT'],
        'SupportedOutputFormats': ['KML', 'NETCDF-4'],
        'SupportedOperatingSystems': [
          {
            'OperatingSystemName': 'Puppy Linux',
            'OperatingSystemVersion': '8.8'
          },
          {
            'OperatingSystemName': 'Tails',
            'OperatingSystemVersion': '9.5'
          }
        ],
        'SupportedBrowsers': [
          {
            'BrowserName': '3B',
            'BrowserVersion': '3.0'
          },
          {
            'BrowserName': 'Retawq',
            'BrowserVersion': '1.1'
          }
        ],
        'SupportedSoftwareLanguages': [
          {
            'SoftwareLanguageName': 'LOLCODE',
            'SoftwareLanguageVersion': 'LOL'
          },
          {
            'SoftwareLanguageName': 'Chicken',
            'SoftwareLanguageVersion': 'Chicken Chicken Chicken Chicken'
          }
        ],
        'Quality': {
          'QualityFlag': 'Reviewed',
          'Traceability': 'traceability',
          'Lineage': 'lineage'
        },
        'AccessConstraints': 'access constraint 1',
        'UseConstraints': {
          'LicenseURL': 'tool.license.boo',
          'LicenseText': 'license text text license'
        },
        'ToolKeywords': [
          {
            'ToolCategory': 'EARTH SCIENCE SERVICES',
            'ToolTopic': 'DATA ANALYSIS AND VISUALIZATION',
            'ToolTerm': 'GEOGRAPHIC INFORMATION SYSTEMS',
            'ToolSpecificTerm': 'DESKTOP GEOGRAPHIC INFORMATION SYSTEMS'
          },
          {
            'ToolCategory': 'EARTH SCIENCE SERVICES',
            'ToolTopic': 'DATA ANALYSIS AND VISUALIZATION',
            'ToolTerm': 'GEOGRAPHIC INFORMATION SYSTEMS',
            'ToolSpecificTerm': 'MOBILE GEOGRAPHIC INFORMATION SYSTEMS'
          }
        ],
        'AncillaryKeywords': ['Ancillary keyword 1', 'Ancillary keyword 2'],
        'Organizations': [
          {
            'Roles': ['SERVICE PROVIDER', 'DEVELOPER'],
            'ShortName': 'UCAR/NCAR/EOL/CEOPDM',
            'LongName': 'CEOP Data Management, Earth Observing Laboratory, National Center for Atmospheric Research, University Corporation for Atmospheric Research',
            'URLValue': 'http://www.eol.ucar.edu/projects/ceop/dm/'
          },
          {
            'Roles': ['PUBLISHER'],
            'ShortName': 'AARHUS-HYDRO',
            'LongName': 'Hydrogeophysics Group, Aarhus University '
          }
        ],
        'ContactGroups': [
          {
            'Roles': ['SERVICE PROVIDER', 'PUBLISHER'],
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
              ]
            }
          },
          {
            'Roles': ['SERVICE PROVIDER'],
            'GroupName': 'Group 2'
          }
        ],
        'ContactPersons': [
          {
            'Roles': ['DEVELOPER', 'SERVICE PROVIDER'],
            'ContactInformation': {
              'ContactMechanisms': [
                {
                  'Type': 'Email',
                  'Value': 'example@example.com'
                }, {
                  'Type': 'Fax',
                  'Value': '800-555-1212'
                }
              ],
              'Addresses': [
                {
                  'StreetAddresses': ['47914 252nd Street'],
                  'City': 'Sioux Falls',
                  'StateProvince': 'SD',
                  'Country': 'USA',
                  'PostalCode': '57198-0001'
                }
              ]
            },
            'FirstName': 'Service Provider Personnel First Name',
            'MiddleName': 'Service Provider Personnel Middle Name',
            'LastName': 'Service Provider Personnel Last Name'
          },
          {
            'Roles': ['DEVELOPER'],
            'LastName': 'Last 2'
          }
        ],
        'PotentialAction': {
          'Type': 'SearchAction',
          'Target': {
            'Type': 'EntryPoint',
            'ResponseContentType': ['text/html'],
            'UrlTemplate': 'https://podaac-tools.jpl.nasa.gov/soto/#b=BlueMarble_ShadedRelief_Bathymetry&l={+layers}&ve={+bbox}&d={+date}',
            "Description": 'the description',
            'HttpMethod': [
              'GET'
            ]
          },
          'QueryInput': [
            {
              "ValueName": 'layers',
              "Description": 'query input description for layers param',
              'ValueRequired': true,
              'ValueType': 'the query input value type'
            },
            {
              "ValueName": 'date',
              "Description": 'query input description for date param',
              'ValueRequired': false,
              'ValueType': 'the query input value type'
            },
            {
              "ValueName": 'bbox',
              "Description": 'query input description for bbox param',
              'ValueRequired': false,
              'ValueType': 'the query input value type'
            }
          ]
        },
        'MetadataSpecification': {
          'URL': 'https://cdn.earthdata.nasa.gov/umm/tool/v1.1',
          'Name': 'UMM-T',
          'Version': '1.1'
        }
      }
    end
  end
end
