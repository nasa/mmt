describe 'Valid Variable Sampling Identifiers Preview', reset_provider: true do
  before do
    login
    ingest_response, _concept_response = publish_variable_draft
    visit variable_path(ingest_response['concept-id'])
  end

  context 'When examining the Sampling Identifiers section' do
    include_examples 'Variable Sampling Identifiers Full Preview'
  end
end
