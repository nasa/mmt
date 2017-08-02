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
      'ValidRange': [
        'Min': 'string',
        'Max': 'string'
      ],
      'FillValue': [
        {
          'Value': 'string'
        }
      ],
      'Dimensions': [
        {
          'Size': 'string'
        }
      ],
      'Set': [
        {
          'Size': 'string',
          'Index': 'string'
        }
      ]
    }}

    short_name nil
    entry_title nil
  end

  factory :full_variable_draft, class: VariableDraft do
    transient do
      draft_short_name nil
      draft_entry_title nil
     end

    native_id 'full_variable_draft_native_id'
    provider_id 'MMT_2'
    draft_type 'VariableDraft'

    # TODO: taken from one of Simon's previous examples. may need to be updated
    # or we may want to make it more generic
    draft {{
      'Name': draft_short_name || 'PNs_LIF',
      'LongName': draft_entry_title || 'Volume mixing ratio of sum of peroxynitrates in air',
      'Definition': 'Volume mixing ratio of sum of peroxynitrates in air measured in units of Npptv (parts per trillion by volume)',
      'Units': 'Npptv',
      'DataType': 'float',
      'Dimensions': [
        {
          'Name': '1, UTC Time represent the starting of 1 second sampling time (seconds)',
          'Size': 3000
        }
      ],
      'ValidRange': [
        {
          'Min': -417,
          'Max': 8836
        }
      ],
      'Scale': 1.0,
      'Offset': 0.0,
      'FillValue': [
        {
          'Value': -9999.0,
          'Type': 'Science',
          'Description': 'Fill Value Description'
        }
      ],
      'VariableType': 'SCIENCE_VARIABLE',
      'Set': [
        {
          'Name': 'DISCOVERAQ',
          'Type': 'REVEAL-TEXAS',
          'Size': 10,
          'Index': 2
        }
      ],
      'Service': [
        {
          'ServiceType': %w(ESI WMS WCS),
          'Visualizable': false,
          'Subsettable': true
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
      'ScienceKeywords': [
        {
          'Category': 'EARTH SCIENCE',
          'Topic': 'ATMOSPHERE',
          'Term': 'ATMOSPHERIC CHEMISTRY',
          'VariableLevel1': 'NITROGEN COMPOUNDS',
          'VariableLevel2': 'Peroxyacyl Nitrate'
        }
      ]
    }}
  end
end
