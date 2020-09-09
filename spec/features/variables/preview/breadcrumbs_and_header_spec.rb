describe 'Variables breadcrumbs and header' do
  before :all do
    collection_ingest_response, _collection_concept_response = publish_collection_draft
    @ingest_response, _concept_response = publish_variable_draft(name: 'Variable Name', collection_concept_id: collection_ingest_response['concept-id'])
  end

  before do
    login
    visit variable_path(@ingest_response['concept-id'])
  end

  context 'when viewing the breadcrumbs' do
    it 'displays the Variable Name' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Variables')
        expect(page).to have_content('Variable Name')
      end
    end
  end

  context 'when viewing the header' do
    it 'has "Manage Variables" as the underlined current header link' do
      within 'main header' do
        expect(page).to have_css('h2.current', text: 'Manage Variables')
      end
    end
  end
end
