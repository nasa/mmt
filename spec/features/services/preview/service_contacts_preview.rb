describe 'Valid Service Draft Service Identification Preview' do
  before do
    login
    ingest_response, @concept_response = publish_service_draft
    visit service_path(ingest_response['concept-id'])
  end

  include_examples 'Service Contacts Full Preview' do
    let(:draft) { @concept_response.body }
  end
end