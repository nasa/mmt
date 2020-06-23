describe 'Valid Service Service Information Preview', reset_provider: true do
  before do
    login
    ingest_response, @concept_response = publish_service_draft
    visit service_path(ingest_response['concept-id'])
  end

  context 'When examining the Service Information section' do
    include_examples 'Service Information Full Preview' do
      let(:draft) { @concept_response.body }
    end
  end
end
