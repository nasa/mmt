class UmmVarSchema11to13 < ActiveRecord::Migration[4.2]
  def up
    Draft.where(draft_type: 'VariableDraft').find_each do |d|
      draft = d.draft

      if draft.key? 'Characteristics'
        characteristics = draft.delete('Characteristics')

        if characteristics.key?('MeasurementConditions') || characteristics.key?('ReportingConditions')
          draft['SamplingIdentifiers'] = [{}]
          draft['SamplingIdentifiers'].first['MeasurementConditions'] = characteristics['MeasurementConditions'] if characteristics.key?('MeasurementConditions')
          draft['SamplingIdentifiers'].first['ReportingConditions'] = characteristics['ReportingConditions'] if characteristics.key?('ReportingConditions')
        end
      end

      if draft.key? 'Measurements'
        measurements = draft.delete('Measurements')

        draft['MeasurementIdentifiers'] = []

        measurements.each_with_index do |measurement, index|
          if measurement.key?('MeasurementName') || measurement.key?('MeasurementSource')
            draft['MeasurementIdentifiers'][index] = {}

            if measurement.key?('MeasurementName')
              draft['MeasurementIdentifiers'][index]['MeasurementName'] = {}
              draft['MeasurementIdentifiers'][index]['MeasurementName']['MeasurementObject'] = measurement['MeasurementName']
            end

            if measurement.key?('MeasurementSource')
              draft['MeasurementIdentifiers'][index]['MeasurementSource'] = measurement['MeasurementSource']
            end

          end

        end
      end
      d.draft = draft
      d.save
    end
  end
end
