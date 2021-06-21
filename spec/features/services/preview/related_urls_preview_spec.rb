describe 'Valid Service Related URLs Preview' do
  before do
    login
    ingest_response, @concept_response = publish_service_draft
    visit service_path(ingest_response['concept-id'])
  end

  include_examples 'Service Related URLs Full Preview'
end
