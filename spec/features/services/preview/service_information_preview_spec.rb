describe 'Valid Service Service Information Preview', reset_provider: true do
  before :all do
    @ingest_response, @concept_response = publish_service_draft
  end

  before do
    login
    visit service_path(@ingest_response['concept-id'])
  end

  context 'When examining the Service Information section' do
    include_examples 'Service Information Full Preview' do
      let(:draft) { @concept_response.body }
    end
  end
end
