class UpdateSchemaRelatedUrlsAndDistributions < ActiveRecord::Migration[4.2]
  def up
    Draft.find_each do |d|
      draft = d.draft

      # Remove Protocol, Caption, ContentType from RelatedUrl(s)
      if draft && draft['RelatedUrls']
        draft['RelatedUrls'].each do |url|
          url.delete('Protocol')
          url.delete('Caption')
          url.delete('ContentType')
        end
      end
      if draft && draft['Organizations']
        draft['Organizations'].each do |org|
          urls = org['RelatedUrls'] || []

          urls.each do |url|
            url.delete('Protocol')
            url.delete('Caption')
            url.delete('ContentType')
          end
        end
      end
      if draft && draft['Personnel']
        draft['Personnel'].each do |org|
          urls = org['RelatedUrls'] || []

          urls.each do |url|
            url.delete('Protocol')
            url.delete('Caption')
            url.delete('ContentType')
          end
        end
      end
      if draft && draft['CollectionCitations']
        draft['CollectionCitations'].each do |citation|
          url = citation['RelatedUrl']
          if url
            url.delete('Protocol')
            url.delete('Caption')
            url.delete('ContentType')
          end
        end
      end
      if draft && draft['PublicationReferences']
        draft['PublicationReferences'].each do |citation|
          url = citation['RelatedUrl']
          if url
            url.delete('Protocol')
            url.delete('Caption')
            url.delete('ContentType')
          end
        end
      end

      # Change DistributionSize to Sizes
      draft['Distributions'].delete('DistributionSize') if draft && draft['Distributions']

      d.draft = draft
      d.save
    end
  end

  def down
    Draft.find_each do |d|
      draft = d.draft

      # Remove Relation
      if draft && draft['RelatedUrls']
        draft['RelatedUrls'].each do |url|
          url.delete('Relation')
        end
      end
      if draft && draft['Organizations']
        draft['Organizations'].each do |org|
          urls = org['RelatedUrls'] || []

          urls.each do |url|
            url.delete('Relation')
          end
        end
      end
      if draft && draft['Personnel']
        draft['Personnel'].each do |org|
          urls = org['RelatedUrls'] || []

          urls.each do |url|
            url.delete('Relation')
          end
        end
      end
      if draft && draft['CollectionCitations']
        draft['CollectionCitations'].each do |citation|
          url = citation['RelatedUrl']
          if url
            url.delete('Relation')
          end
        end
      end
      if draft && draft['PublicationReferences']
        draft['PublicationReferences'].each do |citation|
          url = citation['RelatedUrl']
          if url
            url.delete('Relation')
          end
        end
      end

      # Remove Sizes
      draft['Distributions'].delete('Sizes') if draft && draft['Distributions']

      d.draft = draft
      d.save
    end
  end
end
