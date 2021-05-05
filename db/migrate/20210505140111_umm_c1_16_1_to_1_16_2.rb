class UmmC1161To1162 < ActiveRecord::Migration[5.2]
  def up
    collection_drafts = CollectionDraft.where.not(draft: {})
    proposals = CollectionDraftProposal.where.not(draft: {})
    templates = CollectionTemplate.where.not(draft: {})
    records = collection_drafts + proposals + templates

    records.each do |record|
      if record.draft['UseConstraints']
        use_constraints = record.draft['UseConstraints']

        if use_constraints['Description']
          use_constraints['Description'] = use_constraints.fetch('Description', {}).fetch('Description', '')
        end

        if use_constraints['LicenseUrl']
          use_constraints['LicenseURL'] = use_constraints.delete('LicenseUrl')
        end

        record.save
      end
    end
  end

  def down
    collection_drafts = CollectionDraft.where.not(draft: {})
    proposals = CollectionDraftProposal.where.not(draft: {})
    templates = CollectionTemplate.where.not(draft: {})
    records = collection_drafts + proposals + templates

    records.each do |record|
      if record.draft['UseConstraints']
        use_constraints = record.draft['UseConstraints']

        if use_constraints['Description']
          description = use_constraints['Description']
          use_constraints['Description'] = { 'Description' => description }
        end

        if use_constraints['LicenseURL']
          use_constraints['LicenseUrl'] = use_constraints.delete('LicenseURL')
        end

        record.save
      end
    end
  end
end
