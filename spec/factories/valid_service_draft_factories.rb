FactoryGirl.define do
  factory :empty_service_draft, class: ServiceDraft do
    provider_id 'MMT_2'
    draft_type 'ServiceDraft'

    draft { {} }

    short_name nil
    entry_title nil
  end

  # TODO put real data here
  factory :invalid_service_draft, class: ServiceDraft do
    provider_id 'MMT_2'
    draft_type 'ServiceDraft'

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

  # TODO put real data here
  factory :full_service_draft, class: ServiceDraft do
    transient do
      draft_short_name nil
      draft_entry_title nil
      draft_science_keywords nil
    end

    native_id 'full_service_draft_native_id'
    provider_id 'MMT_2'
    draft_type 'ServiceDraft'

    draft {{
      'Name': draft_short_name || "#{Faker::Space.galaxy}_#{Faker::Number.number(6)}",
      'LongName': draft_entry_title || "#{Faker::Space.nebula} #{Faker::Space.star_cluster} #{Faker::Number.number(6)}",
      'Definition': 'Volume mixing ratio of sum of peroxynitrates in air measured in units of Npptv (parts per trillion by volume)',
      'Units': 'Npptv',
      'DataType': 'float',
      'Dimensions': [
        {
          'Name': '1, UTC Time represent the starting of 1 second sampling time (seconds)',
          'Size': 3000
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
          'Value': -9999.0,
          'Type': 'Science',
          'Description': 'Fill Value Description'
        }
      ],
      'ServiceType': 'SCIENCE_VARIABLE',
      'Sets': [
        {
          'Name': 'DISCOVERAQ',
          'Type': 'REVEAL-TEXAS',
          'Size': 10,
          'Index': 2
        }
      ],
      'Characteristics': {
        'StandardName': 'peroxynitrates',
        'Reference': 'Reference',
        'Coordinates': 'Sampling location given in aircraft navigation data set: DISCOVERAQ-REVEAL-TEXAS',
        'GridMapping': 'N/A',
        'Size': 23,
        'SizeUnits': 'MB',
        'Bounds': 'Lon: -94.5,  -75.5 E; Lat: 29.1, 38.0 N',
        'ChunkSize': 42,
        'Structure': 'float: seconds, NO2_LIF, PNs_LIF, ANs_LIF, HNO3_LIF, NO2_LIF_noise, PNs_LIF_noise, ANs_LIF_noise, HNO3_LIF_noise: 10 granules: different number of lines for each granule',
        'MeasurementConditions': 'Measurement Conditions',
        'ReportingConditions': 'Reporting Conditions'
      },
      'ScienceKeywords': draft_science_keywords || [
        {
          'Category': 'EARTH SCIENCE',
          'Topic': 'ATMOSPHERE',
          'Term': 'ATMOSPHERIC CHEMISTRY',
          'ServiceLevel1': 'NITROGEN COMPOUNDS',
          'ServiceLevel2': 'Peroxyacyl Nitrate'
        }
      ]
    }}
  end
end
