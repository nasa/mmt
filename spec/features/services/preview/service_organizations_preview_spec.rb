describe 'Valid Service Service Organizations Preview', reset_provider: true do
  before do
    login
    ingest_response, _concept_response = publish_service_draft
    visit service_path(ingest_response['concept-id'])
  end

  context 'When examining the Service Organizations section' do
    include_examples 'Service Organizations Full Preview'
  end
end
