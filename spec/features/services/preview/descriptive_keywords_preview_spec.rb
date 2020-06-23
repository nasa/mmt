describe 'Valid Service Service Keywords Preview', reset_provider: true do
  before do
    login
    ingest_response, _concept_response = publish_service_draft
    visit service_path(ingest_response['concept-id'])
  end

  context 'When examining the Service Keywords section' do
    include_examples 'Descriptive Keywords Full Preview'
  end
end
