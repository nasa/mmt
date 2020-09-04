describe 'Valid Variable Science Keywords Preview', reset_provider: true do
  before do
    login
    ingest_response, _concept_response = publish_variable_draft
    visit variable_path(ingest_response['concept-id'])
  end

  context 'When examining the Science Keywords section' do
    include_examples 'Variable Science Keywords Full Preview'
  end
end
