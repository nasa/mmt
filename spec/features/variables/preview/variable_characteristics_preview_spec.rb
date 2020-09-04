describe 'Valid Variable Index Ranges Preview', reset_provider: true do
  before do
    login
    ingest_response, _concept_response = publish_variable_draft
    visit variable_path(ingest_response['concept-id'])
  end

  context 'When examining the Index Ranges section' do
    include_examples 'Variable Index Ranges Full Preview'
  end
end
