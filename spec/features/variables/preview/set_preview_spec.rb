describe 'Valid Variable Set Preview', reset_provider: true do
  before do
    login
    ingest_response, _concept_response = publish_variable_draft
    visit variable_path(ingest_response['concept-id'])
  end

  context 'When examining the Set section' do
    include_examples 'Variable Sets Full Preview'
  end
end
