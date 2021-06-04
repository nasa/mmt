class UmmC1162To1163 < ActiveRecord::Migration[5.2]
  def up; end

  def down
    collection_drafts = CollectionDraft.where.not(draft: {})
    proposals = CollectionDraftProposal.where.not(draft: {})
    templates = CollectionTemplate.where.not(draft: {})
    records = collection_drafts + proposals + templates

    records.each do |record|
      draft = record.draft

      if draft['RelatedUrls'].present?
        # remove any Related Urls that are Get Capabilities
        draft['RelatedUrls'].reject! { |related_url| related_url['Type'] == 'GET CAPABILITIES' }

        draft['RelatedUrls'].each do |related_url|
          # remove any of the new Mime Type
          if related_url.dig('GetData', 'MimeType') == 'application/opensearchdescription+xml'
            related_url['GetData'].delete('MimeType')
          end
          if related_url.dig('GetService', 'MimeType') == 'application/opensearchdescription+xml'
            related_url['GetService'].delete('MimeType')
          end
        end
      end

      # remove new Mime Type from License URL, Publication References, and Collection Citations
      if draft.dig('UseConstraints', 'LicenseURL', 'MimeType') == 'application/opensearchdescription+xml'
        draft['UseConstraints']['LicenseURL'].delete('MimeType')
      end

      if draft['PublicationReferences'].present?
        draft['PublicationReferences'].each do |pub_ref|
          if pub_ref.dig('OnlineResource', 'MimeType') == 'application/opensearchdescription+xml'
            pub_ref['OnlineResource'].delete('MimeType')
          end
        end
      end

      if draft['CollectionCitations'].present?
        draft['CollectionCitations'].each do |coll_cite|
          if coll_cite.dig('OnlineResource', 'MimeType') == 'application/opensearchdescription+xml'
            coll_cite['OnlineResource'].delete('MimeType')
          end
        end
      end

      record.save
    end
  end
end
