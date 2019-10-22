describe 'Downloading Variable JSON', js: true do
  before :all do
    @ingest_response, _concept_response = publish_variable_draft
  end

  context 'when viewing the variable preview page' do
    before do
      login

      visit variable_path(@ingest_response['concept-id'])
    end

    it 'renders the download link' do
      expect(page).to have_link('Download JSON', href: download_json_variable_path(@ingest_response['concept-id']))
    end
  end
end
