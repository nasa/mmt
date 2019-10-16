class UmmVarSchema13to14 < ActiveRecord::Migration[4.2]
  def up
    Draft.where(draft_type: 'VariableDraft').find_each do |d|
      draft = d.draft
      if draft.key? 'SizeEstimation'
        size_estimation = draft.delete('SizeEstimation')
        new_size_estimation = {}
        if size_estimation.key?('AverageSizeOfGranulesSampled')
          new_size_estimation['AverageSizeOfGranulesSampled'] = size_estimation['AverageSizeOfGranulesSampled']

          if size_estimation.key?('AvgCompressionRateASCII') ||
            size_estimation.key?('AvgCompressionRateNetCDF4')
            array = []
            if size_estimation.key?('AvgCompressionRateASCII')
              avg_compression_rate_ascii = size_estimation['AvgCompressionRateASCII']
              array << {"Rate" => avg_compression_rate_ascii, "Format" => 'ASCII'}
            end

            if size_estimation.key?('AvgCompressionRateNetCDF4')
              avg_compression_rate_netcdf4 = size_estimation['AvgCompressionRateNetCDF4']
              array << {"Rate" => avg_compression_rate_netcdf4, "Format" => 'NetCDF-4'}
            end
            new_size_estimation['AverageCompressionInformation'] = array
          end
          draft['SizeEstimation'] = new_size_estimation
          d.draft = draft
          d.save
        end
      end
    end
  end

  def down
    Draft.where(draft_type: 'VariableDraft').find_each do |d|
      draft = d.draft
      if draft.key? 'SizeEstimation'
        size_estimation = draft.delete('SizeEstimation')
        new_size_estimation = {}
        if size_estimation.key?('AverageSizeOfGranulesSampled')
          new_size_estimation['AverageSizeOfGranulesSampled'] = size_estimation['AverageSizeOfGranulesSampled']

          if size_estimation.key?('AverageCompressionInformation')
            array = Array.wrap(size_estimation['AverageCompressionInformation'])
            array.each do |info|
              if info.key?('Rate') && info.key?('Format')
                rate = info['Rate']
                format = info['Format']
                case format
                when 'ASCII'
                  new_size_estimation['AvgCompressionRateASCII'] = rate
                when 'NetCDF-4'
                  new_size_estimation['AvgCompressionRateNetCDF4'] = rate
                else
                  Rails.logger.info("Can't translate record to V3,  format doesn't map to ASCII or NetCDF4, format=#{format} for short_name=#{d.short_name}")
                end
              end
            end

          end
        end
        draft['SizeEstimation'] = new_size_estimation
        d.draft = draft
        d.save
      end
    end
  end
end
