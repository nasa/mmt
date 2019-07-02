# most of the search functionality is tested in bulk_updates_search_spec, so we
# only need to test the specific differences here
describe 'Searching for collection to generate variables', reset_provider: true do
  before :all do
    2.times { publish_collection_draft }
  end

  context 'when viewing the variable generation process search page' do
    before do
      login

      visit new_variable_generation_processes_search_path
    end

    # TODO: we will need to test these when we add OPeNDAP search url search
    it 'displays the correct number of options for search field'
    it 'displays the correct options for the search field'

    context 'when searching for all collections with a wildcard' do
      before do
        select 'Entry Title', from: 'Search Field'
        find(:css, "input[id$='query_text']").fill_in with: '*'
        click_button 'Submit'
      end

      it 'displays the correct number of collections and radio buttons' do
        within '#collection-search-results' do
          expect(page).to have_css('tbody > tr', count: 2)
          expect(page).to have_css("input[type='radio']", count: 2)
        end
      end

      it 'does not have checkboxes' do
        expect(page).to have_no_css("input[type='checkbox']")
      end
    end
  end
end
