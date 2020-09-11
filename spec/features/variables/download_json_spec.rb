describe 'Downloading Variable JSON', js: true do
  before :all do
    collection_ingest_response, _collection_concept_response = publish_collection_draft
    @ingest_response, _concept_response = publish_variable_draft(collection_concept_id: collection_ingest_response['concept-id'])
  end

  context 'when viewing the variable preview page' do
    before do
      login

      visit variable_path(@ingest_response['concept-id'])
    end

    it 'renders the download link' do
      expect(page).to have_link('Download JSON', href: download_json_variable_path(@ingest_response['concept-id']))
    end

    context 'when downloading the json' do
      before do
        @file = "#{Rails.root}/#{@ingest_response['concept-id']}.json"
        click_on 'Download JSON'

        # Seems to need a brief (>0.01) pause to actually find the file.
        sleep(0.1)
      end

      after do
        FileUtils.rm @file if File.exist?(@file)
      end

      it 'downloads the file' do
        expect(File.exist?(@file)).to eq(true)
      end
    end
  end
end
