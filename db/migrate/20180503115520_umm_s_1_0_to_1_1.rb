class UmmS10To11 < ActiveRecord::Migration[4.2]
  def up
    Draft.where(draft_type: 'ServiceDraft').find_each do |d|
      draft = d.draft

      if draft.key? 'AccessConstraints'
        draft['AccessConstraints'] = Array.wrap(draft['AccessConstraints']).first
      end
      if draft.key? 'UseConstraints'
        draft['UseConstraints'] = Array.wrap(draft['UseConstraints']).first
      end

      if draft.key? 'RelatedURL'
        related_url = draft.delete('RelatedURL')
        draft['RelatedURLs'] = [related_url]
      end

      if draft.key? 'ServiceOrganizations'
        Array.wrap(draft['ServiceOrganizations']).each do |org|
          org.delete('Uuid')
        end
      end

      if draft.key? 'Coverage'
        coverage = draft['Coverage']
        coverage_type = coverage.delete('Type')

        if coverage.key? 'CoverageSpatialExtent'
          coverage_spatial_extent_type = coverage['CoverageSpatialExtent'].delete('Type')

          type = coverage_spatial_extent_type || coverage_type
          coverage['CoverageSpatialExtent']['CoverageSpatialExtentTypeType'] = type if type
        end
      end

      d.draft = draft
      d.save
    end
  end
end
