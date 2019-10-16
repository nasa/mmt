class UmmSchema18To19 < ActiveRecord::Migration[4.2]
  def up
    Draft.find_each do |d|
      draft = d.draft

      # Change Sensors to ComposedOf
      if draft && draft.key?('Platforms')
        draft['Platforms'].each do |platform|
          next unless platform.key?('Instruments')

          platform['Instruments'].each do |instrument|
            next unless instrument.key?('Sensors')

            instrument['ComposedOf'] = instrument.delete('Sensors')
            instrument['NumberOfInstruments'] = instrument.delete('NumberOfSensors') if instrument.key?('NumberOfSensors')
          end
        end
      end

      # DOI moved from Collection Citations to top level
      if draft && draft.key?('CollectionCitations')
        doi = nil
        draft['CollectionCitations'].each do |citation|
          break unless doi.nil?
          doi = citation.delete('DOI')
        end

        draft['DOI'] = doi unless doi.nil?
      end

      # RelatedUrl to OnlineResource in PublicationReference and ResourceCitation
      if draft && draft.key?('PublicationReferences')
        draft['PublicationReferences'].each do |publication_reference|
          related_url = publication_reference.delete('RelatedUrl')

          next if related_url.nil?
          online_resource = {}

          online_resource['Linkage'] = related_url['URLs'].first if related_url.key?('URLs') && !related_url['URLs'].empty?
          online_resource['Description'] = related_url['Description'] if related_url.key?('Description')
          online_resource['Name'] = related_url['Title'] if related_url.key?('Title')

          publication_reference['OnlineResource'] = online_resource
        end
      end

      if draft && draft.key?('CollectionCitations')
        draft['CollectionCitations'].each do |collection_citation|
          related_url = collection_citation.delete('RelatedUrl')

          next if related_url.nil?
          online_resource = {}

          online_resource['Linkage'] = related_url['URLs'].first if related_url.key?('URLs') && !related_url['URLs'].empty?
          online_resource['Description'] = related_url['Description'] if related_url.key?('Description')
          online_resource['Name'] = related_url['Title'] if related_url.key?('Title')

          collection_citation['OnlineResource'] = online_resource
        end
      end

      d.draft = draft
      d.save
    end
  end
end
