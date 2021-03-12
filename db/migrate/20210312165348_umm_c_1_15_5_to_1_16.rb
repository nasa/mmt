class UmmC1155To116 < ActiveRecord::Migration[5.2]
  def down
    collection_drafts = CollectionDraft.where.not(draft: {})
    proposals = CollectionDraftProposal.where.not(draft: {})
    templates = CollectionTemplate.where.not(draft: {})
    records = collection_drafts + proposals + templates

    records.each do |record|
      record.draft.delete('DirectDistributionInformation')
      record.save
    end
  end

  def up
  end
end
