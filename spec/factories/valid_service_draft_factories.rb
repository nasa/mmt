FactoryGirl.define do
  factory :empty_service_draft, class: ServiceDraft do
    provider_id 'MMT_2'
    draft_type 'ServiceDraft'

    draft { {} }

    short_name nil
    entry_title nil
  end

  factory :invalid_service_draft, class: ServiceDraft do
    provider_id 'MMT_2'
    draft_type 'ServiceDraft'

    draft {{
      'ScienceKeywords': [
        {
          'Category': 'SPECTRAL/ENGINEERING',
          'Topic': 'INFRARED WAVELENGTHS'
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
      }
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
      'Name': draft_short_name || "#{Faker::HitchhikersGuideToTheGalaxy.location}_#{Faker::Number.number(6)}",
      'LongName': draft_entry_title || "#{Faker::HitchhikersGuideToTheGalaxy.marvin_quote} #{Faker::Number.number(6)}",
      'Type': 'TOOL',
      'Version': '1.0',
      'Description': 'The USGS WRS-2 Path/Row to Latitude/Longitude Converter allows users to enter any Landsat path and row to get the nearest scene center latitude and longitude coordinates.',
      'RelatedURL': {
        'URL': 'http://www.scp.byu.edu/software/slice_response/Xshape_temp.html',
        'Description': 'Access the WRS-2 Path/Row to Latitude/Longitude Converter.',
        'URLContentType': 'DistributionURL',
        'Type': 'GET SERVICE',
        'SubType': 'TOOL'
      },
      'ScienceKeywords': [
        {
          'Category': 'SPECTRAL/ENGINEERING',
          'Topic': 'INFRARED WAVELENGTHS',
          'Term': 'INFRARED IMAGERY'
        }
      ],
      'ServiceKeywords': [
        {
          'ServiceCategory': 'DATA MANAGEMENT/DATA HANDLING',
          'ServiceTopic': 'TRANSFORMATION/CONVERSION'
        }
      ],
      'ServiceOrganizations': [
        {
          'Roles': ['SERVICE PROVIDER'],
          'ShortName': 'USGS/EROS',
          'LongName': 'US GEOLOGICAL SURVEY EARTH RESOURCE OBSERVATION AND SCIENCE (EROS) LANDSAT CUSTOMER SERVICES',
          'Uuid': '005c89f8-39ca-4645-b31a-d06a0118d7a1',
          'ContactPersons': [{
            'Roles': [ 'Service Provider Personnel'],
            'ContactInformation': {
              'ContactMechanisms': [
                {
                  'Type': 'Email',
                  'Value': 'custserv at usgs.gov'
                }, {
                  'Type': 'Fax',
                  'Value': '605-594-6589'
                }, {
                  'Type': 'Telephone',
                  'Value': '605-594-6151'
                }
              ],
              'Addresses': [{
                'StreetAddresses': [ '47914 252nd Street' ],
                'City': 'Sioux Falls',
                'StateProvince': 'SD',
                'Country': 'USA',
                'PostalCode': '57198-0001'
              }]
            },
            'FirstName': 'Service Provider Personnel First Name',
            'MiddleName': 'Service Provider Personnel Middle Name',
            'LastName': 'Service Provider Personnel Last Name'
          }]
        }
      ]
    }}
  end
end
