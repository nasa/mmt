describe 'Searching for published collections in proposal mode', reset_provider: true, js: true do
  short_name = "Search Proposal Mode Collection short name #{Faker::Number.number(6)}"
  entry_title = "Long title for Search Proposal Mode Collection"
  provider = 'MMT_2'

  before :all do
    @ingest_response, @concept_response = publish_collection_draft(short_name: short_name, entry_title: entry_title)
  end

  before do
    set_as_proposal_mode_mmt(with_required_acl: true)
    login
    visit manage_collection_proposals_path
  end

  context 'when viewing all collection search results' do
    before do
      click_on 'Search Collections'
    end

    it 'displays the collection results' do
      # there should be 54 collections ingested with the cmr start up script, plus the one ingested above
      expect(page).to have_content('55 Collection Results')
      expect(page).to have_content('Showing collections 1 - 25 of 55')
    end

    it 'displays the table with the correct columns' do
      within '#search-results thead tr' do
        expect(page).to have_content('Short Name')
        expect(page).to have_content('Entry Title')
        expect(page).to have_content('Provider')
        expect(page).to have_content('Last Modified')

        expect(page).to have_no_content('Version')
        expect(page).to have_no_content('Granule Count')
      end
    end
  end

  context 'when searching for a specific collection' do
    before do
      fill_in 'keyword', with: short_name
      click_on 'Search Collections'
    end

    it 'displays the correct values in the search results table' do
      within '#search-results tbody tr:nth-child(1)' do
        expect(page).to have_content(short_name)
        expect(page).to have_content(entry_title)
        expect(page).to have_content(provider)
        expect(page).to have_content(today_string)
      end
    end

    context 'when viewing the collection' do
      before do
        click_on short_name
      end

      it 'displays the collection preview page' do
        within '#collection-general-overview' do
          expect(page).to have_content("Short Name: #{short_name}", normalize_ws: true)
          expect(page).to have_content(entry_title)
        end

        within '#collection-preview-tabs' do
          expect(page).to have_content('Overview')
          expect(page).to have_content('Download Data')
          expect(page).to have_content('Citation Information')
          expect(page).to have_content('Documentation')
          expect(page).to have_content('Additional Information')
        end
      end

      it 'does not display the actions for collections in MMT proper' do
        # TODO when we have the actions for collections added in Draft MMT
        # we should change the text for this test and add those checks here
        within '.action' do
          expect(page).to have_no_link('Edit Collection Record')
          expect(page).to have_no_link('Clone Collection Record')
          expect(page).to have_no_link('Delete Collection Record')
          expect(page).to have_no_link('Revisions (1)')
          expect(page).to have_no_link('Granules (0)')
          expect(page).to have_no_link('Save as Template')
        end
      end
    end
  end
end
