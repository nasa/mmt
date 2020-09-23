FactoryBot.define do
  factory :full_variable_draft_1_6, class: VariableDraft do
    transient do
      draft_name { nil }
      draft_group_path { nil }
    end

    native_id { 'full_variable_draft_native_id' }
    provider_id { 'MMT_2' }
    draft_type { 'VariableDraft' }

    draft do
      shared_fields_umm_v_1_6_and_1_7.merge({
        'Name': draft_name || "#{Faker::Space.galaxy}_#{Faker::Number.number(digits: 6)}",
        'Alias': "An Alias",
        "AcquisitionSourceName": 'ATM',
        "Characteristics": {
          "GroupPath": draft_group_path || "/Data_Fields/",
          "IndexRanges":
          {
            "LatRange": [
              -90.0,
              90.0
            ],
            "LonRange": [
              -180.0,
              180.0
            ]
          }
        },
        "SizeEstimation":
          {
            "AverageSizeOfGranulesSampled": 3009960,
            "AverageCompressionInformation": [
              {
                "Rate": 4.0,
                "Format": "ASCII"
              },
              {
                "Rate": 0.132,
                "Format": "NetCDF-4"
              }
            ]
          }
        })
      end
    end

  factory :full_variable_draft_1_7, class: VariableDraft do
    native_id { 'full_variable_draft_native_id' }
    provider_id { 'MMT_2' }
    draft_type { 'VariableDraft' }

    draft do
      shared_fields_umm_v_1_6_and_1_7.merge({
        'Name': "#{Faker::Space.galaxy}_#{Faker::Number.number(digits: 6)}",
        'StandardName': 'Standard_Name_1',
        'AdditionalIdentifiers': [
          {
            'Identifier': 'Additional_Identifier_Identifier_1'
          },
          {
            'Identifier': 'Additional_Identifier_Identifier_2',
            'Description': 'Additional_Identifier_Description_2'
          }
        ],
        'IndexRanges':
          {
            'LatRange': [
              -90.0,
              90.0
            ],
            'LonRange': [
              -180.0,
              180.0
            ]
          }
        })
      end
    end
  end

  def shared_fields_umm_v_1_6_and_1_7
    {
      'LongName': "#{Faker::Space.nebula} #{Faker::Space.star_cluster} #{Faker::Number.number(digits: 6)}",
      'Definition': 'Volume mixing ratio of sum of peroxynitrates in air measured in units of Npptv (parts per trillion by volume)',
      'Units': 'Npptv',
      'DataType': 'float',
      'Scale': 1.0,
      'Offset': 0.0,
      'VariableType': 'SCIENCE_VARIABLE',
      "VariableSubType": "SCIENCE_SCALAR",
      'ValidRanges': [
        {
          'Min': -417,
          'Max': 8836,
          'CodeSystemIdentifierMeaning': ['Code System Identifier Meaning 1', 'Code System Identifier Meaning 2'],
          'CodeSystemIdentifierValue': ['Code System Identifier Value 1', 'Code System Identifier Value 2', 'Code System Identifier Value 3']
        },
        {
          'Min': 0.0,
          'Max': 1.0,
          'CodeSystemIdentifierMeaning': ['Code System Identifier Meaning 1', 'Code System Identifier Meaning 2', 'Code System Identifier Meaning 3'],
          'CodeSystemIdentifierValue': ['Code System Identifier Value 1', 'Code System Identifier Value 2']
        }
      ],
      'FillValues': [
        {
          'Type': 'SCIENCE_FILLVALUE',
          'Value': -9999.0,
          'Description': 'Pellentesque Bibendum Commodo Fringilla Nullam'
        },
        {
          'Type': 'ANCILLARY_FILLVALUE',
          'Value': 111.0,
          'Description': 'Pellentesque Nullam Ullamcorper Magna'
        }
      ],
      'Dimensions': [
        {
          'Name': 'LatDim',
          'Size': 36,
          'Type': 'LATITUDE_DIMENSION'
        },
        {
          'Name': 'Lizard Herp Doc Pop',
          'Size': 2020,
          'Type': 'LONGITUDE_DIMENSION'
        }
      ],
      "MeasurementIdentifiers":
      [
        {
          "MeasurementContextMedium": "ocean",
          "MeasurementContextMediumURI": "fake.website.gov",
          "MeasurementObject": "sea_ice-meltwater",
          "MeasurementObjectURI": "fake.website.gov",
          "MeasurementQuantities": [
            {
              "MeasurementQuantityURI": "fake.website.gov",
              "Value": "volume"
            },
            {
              "Value": "volume"
            }
          ]
        },
        {
          "MeasurementContextMedium": "ocean",
          "MeasurementObject": "sea_ice-meltwater",
          "MeasurementQuantities": [
            {
              "Value": "volume"
            }
          ]
        }
      ],
      "SamplingIdentifiers": [
        {
          "SamplingMethod": "Satellite overpass",
          "MeasurementConditions": "Measured at top of atmosphere (specifically at the top of the mesosphere, i.e. the mesopause).",
          "ReportingConditions": "At 50 km from the surface, pressure is 1MB and temperature is -130 degrees F."
        },
        {
          "SamplingMethod": "Satellite overpass 1",
          "MeasurementConditions": "Measured at bottom of atmosphere",
          "ReportingConditions": "At 1 km from the surface, pressure is 1MB and temperature is 32 degrees F."
        }
      ],
      'ScienceKeywords': [
        {
          'Category': 'EARTH SCIENCE',
          'Topic': 'SOLID EARTH',
          'Term': 'ROCKS/MINERALS/CRYSTALS'
        },
        {
          'Category': 'EARTH SCIENCE',
          'Topic': 'ATMOSPHERE',
          'Term': 'ATMOSPHERIC TEMPERATURE'
        }
      ],
      'Sets': [
        {
          'Name': 'Science',
          'Type': 'Land',
          'Size': 50,
          'Index': 1
        },
        {
          'Name': 'Fiction',
          'Type': 'Water',
          'Size': 100,
          'Index': 2
        }
      ]
    }
  end
