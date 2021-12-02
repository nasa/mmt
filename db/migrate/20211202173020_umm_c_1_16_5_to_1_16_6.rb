class UmmC1165To1166 < ActiveRecord::Migration[5.2]
  def up; end

  def down
    collection_drafts = CollectionDraft.where.not(draft: {})
    proposals = CollectionDraftProposal.where.not(draft: {})
    templates = CollectionTemplate.where.not(draft: {})
    records = collection_drafts + proposals + templates

    records.each do |record|
      draft = record.draft

      if draft['UseConstraints'].present?
        unless draft['UseConstraints']['FreeAndOpenData'].nil?
          draft['UseConstraints'].delete('FreeAndOpenData')
        end
      end

      record.save
    end
  end
end
