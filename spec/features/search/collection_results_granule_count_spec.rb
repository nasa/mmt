describe 'Collection Search Results Granule Count', js: true do
  before do
    login
    collections_response = cmr_success_response(File.read('spec/fixtures/collections/search_collections_response.json'))
    allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections_by_post).and_return(collections_response)
    visit manage_collections_path
  end

  context 'when viewing collection search results' do
    before do
      click_on 'Search Collections'
    end

    it 'displays list with column granule count' do
      within '#search-results thead' do
        expect(page).to have_content('Granule Count')
      end

      within '#search-results tbody tr:nth-child(1) td:nth-child(6)' do
        expect(page).to have_content('2345')
      end
    end
  end
end