FactoryBot.define do
  factory :empty_tool_draft, class: ToolDraft do
    provider_id { 'MMT_2' }
    draft_type { 'ToolDraft' }

    draft { {} }

    short_name { nil }
    entry_title { nil }
  end

  # factory :invalid_tool_draft, class: ToolDraft do
  # end

  factory :full_tool_draft, class: ToolDraft do
    transient do
      draft_short_name { nil }
      draft_entry_title { nil }
    end

    native_id { 'full_tool_draft_native_id' }
    provider_id { 'MMT_2' }
    draft_type { 'ToolDraft' }

    draft {{
      'Name': 'USGS_TOOLS_LATLONG',
      'LongName': 'WRS-2 Path/Row to Latitude/Longitude Converter',
      'Type': 'Downloadable Tool',
      'Version': '1.0',
      'Description': 'The USGS WRS-2 Path/Row to Latitude/Longitude Converter allows users to enter any Landsat path and row to get the nearest scene center latitude and longitude coordinates.',
      'URL': {
        'URLContentType': 'DistributionURL',
        'Type': 'DOWNLOAD SOFTWARE',
        'Description': 'Access the WRS-2 Path/Row to Latitude/Longitude Converter.',
        'URLValue': 'http://www.scp.byu.edu/software/slice_response/Xshape_temp.html'
      },
      'ToolKeywords': [{
        'ToolCategory': 'EARTH SCIENCE SERVICES',
        'ToolTopic': 'DATA MANAGEMENT/DATA HANDLING',
        'ToolTerm': 'DATA INTEROPERABILITY',
        'ToolSpecificTerm': 'DATA REFORMATTING'
      }],
      'Organizations': [
        {
          'Roles': ['SERVICE PROVIDER'],
          'ShortName': 'USGS/EROS',
          'LongName': 'US GEOLOGICAL SURVEY EARTH RESOURCE OBSERVATION AND SCIENCE (EROS) LANDSAT CUSTOMER SERVICES',
          'URLValue': 'http://www.usgs.gov'
        }
      ],
      'ContactPersons': [{
        'Roles': ['SERVICE PROVIDER'],
        'ContactInformation': {
          'ContactMechanisms': [{
            'Type': 'Email',
            'Value': 'custserv at usgs.gov'
          }, {
            'Type': 'Fax',
            'Value': '605-594-6589'
          }, {
            'Type': 'Telephone',
            'Value': '605-594-6151'
          }],
          'Addresses': [{
            'StreetAddresses': ['47914 252nd Street'],
            'City': 'Sioux Falls',
            'StateProvince': 'SD',
            'Country': 'USA',
            'PostalCode': '57198-0001'
          }]
        },
        'FirstName': 'Service Provider Personnel First Name',
        'MiddleName': 'Service Provider Personnel Middle Name',
        'LastName': 'Service Provider Personnel Last Name'
      }],
      'MetadataSpecification': {
        'URL': 'https://cdn.earthdata.nasa.gov/umm/tool/v1.0',
        'Name': 'UMM-T',
        'Version': '1.0'
      }
    }}
  end
end
