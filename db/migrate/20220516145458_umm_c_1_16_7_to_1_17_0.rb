class UmmC1167To1170 < ActiveRecord::Migration[5.2]

  #logic to go from version 1.16.7 to 1.17.0
  def up
    Draft.find_each do |d|
      draft = d.draft
      if draft.dig('SpatialExtent', 'OrbitParameters', 'Period').present?
        period = draft['SpatialExtent']['OrbitParameters'].delete('Period')
        draft['SpatialExtent']['OrbitParameters']['OrbitPeriod'] = period
        d.draft = draft
        Rails.logger.info("Renaming period to orbit period for #{d.id}")
        d.save
      end
    end
  end

  # logic to go from version 1.17.0 to 1.16.7
  def down
    Draft.find_each do |d|
      draft = d.draft
      if draft.dig('SpatialExtent', 'OrbitParameters', 'OrbitPeriod').present?
        orbit_period = draft['SpatialExtent']['OrbitParameters'].delete('OrbitPeriod')
        draft['SpatialExtent']['OrbitParameters']['Period'] = orbit_period
        d.draft = draft
        Rails.logger.info("Renaming orbit period to period for #{d.id}")
        d.save
      end
    end
  end
end
