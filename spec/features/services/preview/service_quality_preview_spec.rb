# EDL Failed Test
describe 'Valid Service Service Quality Preview', skip:true do
  before do
    login
    ingest_response, @concept_response = publish_service_draft
    visit service_path(ingest_response['concept-id'])
  end

  include_examples 'Service Quality Full Preview' do
    let(:draft) { @concept_response.body }
  end
end
