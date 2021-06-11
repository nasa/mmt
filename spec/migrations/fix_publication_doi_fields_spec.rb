require File.join(Rails.root, 'db', 'migrate', '20210610163713_fix_publication_doi_fields')

describe 'Migration tests for Publication DOIs fix' do
  let(:publication_doi) do
    {
      'MissingReason' => 'Unknown',
      'Explanation' => 'explanation'
    }
  end

  let(:available_doi) do
    {
      'DOI' => 'Publication reference DOI',
      'Authority' => 'Publication reference authority'
    }
  end

  context 'when doing the migration in MMT' do
    before do
      @draft = create(:full_collection_draft)
      @template = create(:full_collection_template)

      @draft.draft['PublicationReferences'][1]['DOI'] = publication_doi
      @template.draft['PublicationReferences'][1]['DOI'] = publication_doi

      @draft.save
      @template.save

      FixPublicationDoiFields.new.change
    end

    after do
      CollectionDraft.delete([@draft.id])
      CollectionTemplate.delete([@template.id])
    end

    it 'removes the DOI field from the second Publication Reference but not the first' do
      expect(CollectionDraft.find(@draft.id).draft.dig('PublicationReferences',0,'DOI')).to eq(available_doi)
      expect(CollectionTemplate.find(@template.id).draft.dig('PublicationReferences',1,'DOI')).to be_nil
    end
  end
end
