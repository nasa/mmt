describe 'Valid Variable Fill Value Preview', reset_provider: true do
  before do
    login
    ingest_response, _concept_response = publish_variable_draft
    visit variable_path(ingest_response['concept-id'])
  end

  context 'When examining the Fill Value section' do
    include_examples 'Variable Fill Value Full Preview'
  end
end
