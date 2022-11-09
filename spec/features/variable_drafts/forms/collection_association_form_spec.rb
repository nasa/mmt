describe 'Variable Drafts Collection Association Form', js: true, reset_provider: true do
  let(:empty_draft) { create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first) }
  let(:full_draft) { create(:full_variable_draft, user: User.where(urs_uid: 'testuser').first, collection_concept_id: 'C12345-MMT_2') }

  before do
    login
  end

  context 'When viewing the form with no stored values' do
    before do
      visit collection_search_variable_draft_path(empty_draft)
    end

    it 'displays the correct title' do
      within '.variable-form' do
        expect(page).to have_content('Collection Association')
      end
    end

    it 'displays the form title in the breadcrumbs' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Variable Drafts')
        expect(page).to have_content('<Blank Name>')
        expect(page).to have_content('Collection Association Search')
      end
    end

    it 'displays the table with the correct collection information' do
      within '#variable-draft-collection-association-table tbody tr:nth-child(1)' do
        expect(page).to have_content('No Collection Association found. A Collection must be selected in order to publish this Variable Draft. Each Variable can only be associated with a single Collection.')
      end
    end

    it 'has 2 required labels' do
      expect(page).to have_selector('label.eui-required-o', count: 2)
    end

    it 'has the correct search fields' do
      expect(page).to have_select('Search Field')
      expect(page).to have_css("input[id$='query_text']")
    end
  end

  context 'when viewing the form with a stored value for a non-existing collection' do
    before do
      visit collection_search_variable_draft_path(full_draft)
    end

    it 'displays the table with the correct collection information' do
      within '#variable-draft-collection-association-table tbody tr:nth-child(1)' do
        expect(page).to have_content('There was an error retrieving Collection C12345-MMT_2 because the collection does not exist.')
      end
    end
  end

  context 'when viewing the form with a stored value but a collection search error' do
    before do
      error_body = '{"message": "useless message"}'
      error_response = Cmr::Response.new(Faraday::Response.new(status: 401, body: JSON.parse(error_body), response_headers: {}))
      allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections_by_post).and_return(error_response)

      visit collection_search_variable_draft_path(full_draft)
    end

    it 'displays the table with the correct collection information' do
      within '#variable-draft-collection-association-table tbody tr:nth-child(1)' do
        expect(page).to have_content('There was an error retrieving Collection C12345-MMT_2 that is currently selected as the Collection to be associated with this Variable Draft.')
      end
    end
  end
end
