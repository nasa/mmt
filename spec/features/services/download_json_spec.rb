describe 'Downloading Service JSON', js: true do
  before :all do
    @ingest_response, _concept_response = publish_service_draft
  end

  context 'when viewing the service preview page' do
    before do
      login

      visit service_path(@ingest_response['concept-id'])
    end

    it 'renders the download link' do
      expect(page).to have_link('Download JSON', href: download_json_service_path(@ingest_response['concept-id']))
    end
  end
end
