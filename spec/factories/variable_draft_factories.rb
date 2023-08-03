FactoryBot.define do
  factory :empty_variable_draft, class: VariableDraft do
    provider_id { 'MMT_2' }
    draft_type { 'VariableDraft' }

    draft { {} }

    short_name { nil }
    entry_title { nil }
  end

  factory :invalid_variable_draft, class: VariableDraft do
    provider_id { 'MMT_2' }
    draft_type { 'VariableDraft' }

    # Fields with 'string' as a value are invalid because they require numbers.
    draft do
      {
        'Scale': 'string',
        'Offset': 'string',
        'ValidRanges': [
          {
            'Min': 'string',
            'Max': 'string'
          }
        ],
        'IndexRanges':
        {
          'LatRange': [
            'string',
            90.0
          ],
          'LonRange': [
            -180.0,
            180.0
          ]
        },
        'FillValues': [
          {
            'Value': 'string'
          }
        ],
        'Dimensions': [
          {
            'Size': 'string'
          }
        ],
        'Sets': [
          {
            'Size': 'string',
            'Index': 'string'
          }
        ],
        'RelatedURLs': [
          {
            'Description': 'Test related url'
          }
        ],
        'MetadataSpecification': {
          'Name': 'UMM-Var',
          'URL': 'https://cdn.earthdata.nasa.gov/umm/variable/v1.9.0',
          'Version': '1.9.0'
        }
      }
    end

    short_name { nil }
    entry_title { nil }
  end

  factory :full_variable_draft, class: VariableDraft do
    transient do
      draft_short_name { nil }
      draft_entry_title { nil }
      draft_science_keywords { nil }
      draft_collection_concept_id { nil }
    end

    native_id { 'full_variable_draft_native_id' }
    provider_id { 'MMT_2' }
    draft_type { 'VariableDraft' }
    collection_concept_id { draft_collection_concept_id }

    draft do
      {
        'Name': draft_short_name || "#{Faker::Space.galaxy}_#{Faker::Number.number(digits: 6)}",
        'StandardName': 'Standard_Name_1',
        'LongName': draft_entry_title || "#{Faker::Space.nebula} #{Faker::Space.star_cluster} #{Faker::Number.number(digits: 6)}",
        'Definition': 'Volume mixing ratio of sum of peroxynitrates in air measured in units of Npptv (parts per trillion by volume)',
        'AdditionalIdentifiers': [
          {
            'Identifier': 'Additional_Identifier_Identifier_1'
          },
          {
            'Identifier': 'Additional_Identifier_Identifier_2',
            'Description': 'Additional_Identifier_Description_2'
          }
        ],
        'VariableType': 'SCIENCE_VARIABLE',
        'VariableSubType': 'SCIENCE_SCALAR',
        'Units': 'Npptv',
        'DataType': 'float',
        'Scale': 1.0,
        'Offset': 0.0,
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
        },
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
        'MeasurementIdentifiers': [
          {
            'MeasurementContextMedium': 'ocean',
            'MeasurementContextMediumURI': 'ocean.gov',
            'MeasurementObject': 'sea_ice',
            'MeasurementObjectURI': 'sea-ice.ocean.gov',
            'MeasurementQuantities': [
              {
                'MeasurementQuantityURI': 'sea-ice.ocean.gov/albedo',
                'Value': 'albedo'
              },
              {
                'Value': 'bottom_depth'
              }
            ]
          },
          {
            'MeasurementContextMedium': 'ocean',
            'MeasurementObject': 'sea_ice-meltwater',
            'MeasurementQuantities': [
              {
                'Value': 'volume'
              }
            ]
          }
        ],
        'SamplingIdentifiers': [
          {
            'SamplingMethod': 'Satellite overpass',
            'MeasurementConditions': 'Measured at top of atmosphere (specifically at the top of the mesosphere, i.e. the mesopause).',
            'ReportingConditions': 'At 50 km from the surface, pressure is 1MB and temperature is -130 degrees F.'
          },
          {
            'SamplingMethod': 'Satellite overpass 1',
            'MeasurementConditions': 'Measured at bottom of atmosphere',
            'ReportingConditions': 'At 1 km from the surface, pressure is 1MB and temperature is 32 degrees F.'
          }
        ],
        'ScienceKeywords': draft_science_keywords || [
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
        ],
        'RelatedURLs': [
          {
            'Description': 'Test related url',
            'URLContentType': 'PublicationURL',
            'Type': 'VIEW RELATED INFORMATION',
            'Subtype': 'SCIENCE DATA PRODUCT SOFTWARE DOCUMENTATION',
            'URL': 'science.org',
            'Format': 'HTML'
          },
          {
            'Description': 'Test another related url',
            'URLContentType': 'PublicationURL',
            'Type': 'VIEW RELATED INFORMATION',
            'Subtype': 'ALGORITHM THEORETICAL BASIS DOCUMENT (ATBD)',
            'URL': 'algorithms.org',
            'MimeType': 'text/markdown'
          }
        ],
        'MetadataSpecification': {
          'Name': 'UMM-Var',
          'URL': 'https://cdn.earthdata.nasa.gov/umm/variable/v1.9.0',
          'Version': '1.9.0'
        }
      }
    end
  end
end
