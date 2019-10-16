class UmmSchema12To13 < ActiveRecord::Migration[4.2]
  def up
    Draft.find_each do |d|
      draft = d.draft

      if draft && draft.key?('PaleoTemporalCoverage')
        paleo_temporal_coverage = draft.delete('PaleoTemporalCoverage')

        # PaleoTemporalCoverage to PaleoTemporalCoverages
        draft['PaleoTemporalCoverages'] = Array.wrap(paleo_temporal_coverage)

        d.draft = draft
        d.save
      end
    end
  end

  def down
    Draft.find_each do |d|
      draft = d.draft

      if draft && draft.key?('PaleoTemporalCoverages')
        paleo_temporal_coverages = draft.delete('PaleoTemporalCoverages')

        draft['PaleoTemporalCoverage'] = paleo_temporal_coverages.first

        d.draft = draft
        d.save
      end
    end
  end
end
