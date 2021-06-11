class FixPublicationDoiFields < ActiveRecord::Migration[5.2]

  def change
    collection_drafts = CollectionDraft.where.not(draft: {})
    proposals = CollectionDraftProposal.where.not(draft: {})
    templates = CollectionTemplate.where.not(draft: {})
    records = collection_drafts + proposals + templates

    records.each do |record|
      if record.draft['PublicationReferences']
        record.draft['PublicationReferences'].each do |pub_ref|
          pub_ref.delete('DOI') if pub_ref.dig('DOI', 'MissingReason') || pub_ref.dig('DOI', 'Explanation')
        end

        record.save
      end
    end
  end
end
