class UmmC1166To1167 < ActiveRecord::Migration[5.2]
  # UMM-C 1.16.6 -> 1.16.7
  def up; end

  def down
    collection_drafts = CollectionDraft.where.not(draft: {})
    proposals = CollectionDraftProposal.where.not(draft: {})
    templates = CollectionTemplate.where.not(draft: {})
    records = collection_drafts + proposals + templates

    records.each do |record|
      draft = record.draft

      if draft['CollectionDataType'] == 'LOW_LATENCY' || draft['CollectionDataType'] == EXPEDITED
        draft['CollectionDataType'] = 'NEAR_REAL_TIME'
      end

      record.save
    end
  end
end
