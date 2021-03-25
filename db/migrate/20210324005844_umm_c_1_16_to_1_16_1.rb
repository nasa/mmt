class UmmC116To1161 < ActiveRecord::Migration[5.2]
  def up
  end
  
  def down
    collection_drafts = CollectionDraft.where.not(draft: {})
    proposals = CollectionDraftProposal.where.not(draft: {})
    templates = CollectionTemplate.where.not(draft: {})
    records = collection_drafts + proposals + templates

    records.each do |record|
      record.draft.delete('AssociatedDOIs')
      record.save
    end
  end
end
