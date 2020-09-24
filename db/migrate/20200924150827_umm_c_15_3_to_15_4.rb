class UmmC153To154 < ActiveRecord::Migration[5.2]
  def up
  end

  def down
    collection_drafts = CollectionDraft.where.not(draft: {})
    proposals = CollectionDraftProposal.where.not(draft: {})
    templates = CollectionTemplate.where.not(draft: {})

    records = collection_drafts + proposals + templates

    records.each do |record|
      draft = record.draft
      record['TilingIdentificationSystems'].each do |tiling_id_system|
        tiling_id_system['TilingIdentificationSystemName'].delete if tiling_id_system['TilingIdentificationSystemName'] = 'Military Grid Reference System'
      end if record['TilingIdentificationSystems'].present?
    end
  end
end
