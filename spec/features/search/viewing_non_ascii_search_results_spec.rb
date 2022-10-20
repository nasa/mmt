# EDL Failed Test
describe 'Viewing non-ASCII collection search results', js: true, skip:true do
  let(:short_name) { 'dif10_datasetéñ1' }
  let(:entry_title) { 'DIF10_datasét1' }

  context 'when searching collections with a non-ASCII short name' do
    before do
      login
      visit manage_collections_path
      fill_in 'keyword', with: short_name
      click_on 'Search Collections'
    end

    it 'displays the search results without errors' do
      within 'table#search-results' do
        expect(page).to have_content(short_name)
        expect(page).to have_content(entry_title)
      end
    end

    context 'when viewing a collection with a non-ASCII short name' do
      before do
        within 'table#search-results' do
          click_on short_name
        end
      end

      it 'displays the collection without errors' do
        expect(page).to have_content("#{short_name}_001")
      end
    end
  end
end
