describe 'Collections with NEAR_REAL_TIME' do
  before(:all) do
    @ingest_response, _concept_response = publish_collection_draft(collection_data_type: 'NEAR_REAL_TIME')
  end

  context 'When viewing a collection with NEAR_REAL_TIME' do
    before do
      login
      visit collection_path(ingest_response['concept-id'])
    end

    it 'displays the NRT badge' do
      within '#collection-general-overview .collection-title .title-nrt-badge' do
        expect(page).to have_css('span.eui-badge.nrt', text: 'NRT')
      end
    end
  end
end
