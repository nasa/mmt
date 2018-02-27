FactoryGirl.define do
  factory :empty_variable_draft, class: VariableDraft do
    provider_id 'MMT_2'
    draft_type 'VariableDraft'

    draft { {} }

    short_name nil
    entry_title nil
  end

  factory :invalid_variable_draft, class: VariableDraft do
    provider_id 'MMT_2'
    draft_type 'VariableDraft'

    draft {{
      'Scale': 'string',
      'Offset': 'string',
      'ValidRanges': [
        {
          'Min': 'string',
          'Max': 'string'
        }
      ],
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
      'Characteristics': {
        'Size': 'string',
        'ChunkSize': 'string'
      }
    }}

    short_name nil
    entry_title nil
  end

  factory :full_variable_draft, class: VariableDraft do
    transient do
      draft_short_name nil
      draft_entry_title nil
      draft_science_keywords nil
    end

    native_id 'full_variable_draft_native_id'
    provider_id 'MMT_2'
    draft_type 'VariableDraft'

    draft {{
      'Name': draft_short_name || "#{Faker::Space.galaxy}_#{Faker::Number.number(6)}",
      'LongName': draft_entry_title || "#{Faker::Space.nebula} #{Faker::Space.star_cluster} #{Faker::Number.number(6)}",
      'Definition': 'Volume mixing ratio of sum of peroxynitrates in air measured in units of Npptv (parts per trillion by volume)',
      'Units': 'Npptv',
      'DataType': 'float',
      'Dimensions': [
        {
          'Name': 'Sampling time and depth',
          'Size': 3000
        },
        {
          'Name': 'Lizard Herp Doc Pop',
          'Size': 2020
        }
      ],
      'ValidRanges': [
        {
          'Min': -417,
          'Max': 8836
        }
      ],
      'Scale': 1.0,
      'Offset': 0.0,
      'FillValues': [
        {
          'Type': 'Science',
          'Value': -9999.0,
          'Description': 'Pellentesque Bibendum Commodo Fringilla Nullam'
        },
        {
          'Type': 'Fiction',
          'Value': 111.0,
          'Description': 'Pellentesque Nullam Ullamcorper Magna'
        }
      ],
      'VariableType': 'SCIENCE_VARIABLE',
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
      'Characteristics': {
        'StandardName': 'Tortor Ultricies Nibh Adipiscing',
        'Reference': 'https://developer.earthdata.nasa.gov/',
        'Coordinates': '38.8059922,-77.0435327',
        'GridMapping': 'Mercator',
        'Size': 10.0,
        'SizeUnits': 'nm',
        'Bounds': 'UpperLeftPointMtrs = -180.0, 89.5; LowerRightMtrs = 177.5, -89.5',
        'ChunkSize': 100.0,
        'Structure': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'MeasurementConditions': 'Nulla vitae elit libero, a pharetra augue.',
        'ReportingConditions': 'Cras justo odio, dapibus ac facilisis in, egestas eget quam.'
      },
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
      ]
    }}
  end
end
