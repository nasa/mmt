describe 'Valid Variable Dimensions Preview', reset_provider: true do
  before do
    login
    ingest_response, _concept_response = publish_variable_draft
    visit variable_path(ingest_response['concept-id'])
  end

  context 'When examining the Dimensions section' do
    include_examples 'Variable Dimensions Full Preview'
  end
end
