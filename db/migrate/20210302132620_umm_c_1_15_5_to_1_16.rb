class UmmC1155To116 < ActiveRecord::Migration[5.2]

  def records
    collection_drafts = CollectionDraft.where.not(draft: {})
    proposals = CollectionDraftProposal.where.not(draft: {})
    templates = CollectionTemplate.where.not(draft: {})
    collection_drafts + proposals + templates
  end

  def down
    records.each do |record|
      record.delete('DirectDistributionInformation') 
    end
  end

  def up
  end
end
