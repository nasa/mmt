describe 'Valid Variable Variable Information Preview', reset_provider: true do
  before do
    login
    ingest_response, _concept_response = publish_variable_draft(name: 'PNs_LIF', long_name: 'Volume mixing ratio of sum of peroxynitrates in air')
    visit variable_path(ingest_response['concept-id'])
  end

  context 'When examining the Variable Information section' do
    include_examples 'Variable Information Full Preview'
  end
end
