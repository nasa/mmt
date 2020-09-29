# this test covers search functionality for controllers that inherit from CmrSearchController
describe 'Searching collections to bulk update', reset_provider: true do
  before :all do
    # Create a few collections with unique attributes that we can search for
    2.times { |i| publish_collection_draft(version: "nasa.001#{i}") }
    3.times { |i| publish_collection_draft(short_name: "nasa.002#{i}") }
    1.times { |i| publish_collection_draft(version: "nasa.003#{i}", short_name: "nasa.003#{i}") }
  end

  context 'when viewing the bulk update search page', js: true do
    before do
      login

      visit new_bulk_updates_search_path
    end

    it 'displays the correct number of options for search field' do
      within '#collection-search' do
        expect(page).to have_css('select[name$="[field]"] option', count: BulkUpdatesHelper::SEARCHABLE_KEYS.count)
      end
    end

    it 'displays the correct options for the search field' do
      within '#collection-field-container' do
        options = BulkUpdatesHelper::SEARCHABLE_KEYS.map { |_key, value| value[:title] }

        expect(page).to have_select(options: options)
      end
    end

    context 'when clicking submit without a search query' do
      before do
        within '#collection-search' do
          click_button 'Submit'
        end
      end

      it 'displays an appropriate error message' do
        expect(page).to have_content('Search Term is required.')
      end
    end

    context 'when clicking submit without a temporal query' do
      before do
        within '#collection-search' do
          select 'Temporal Extent', from: 'Search Field'

          click_button 'Submit'
        end
      end

      it 'displays an appropriate error message' do
        expect(page).to have_content('At least one date is required.', count: 1)
      end

      context 'when clicking submit after filling out one temporal date' do
        before do
          within '#collection-search' do
            find(:css, "input[id$='query_date_start']").set('2015-05-27T00:00:00Z')

            click_button 'Submit'
          end
        end

        it 'does not display an error message' do
          expect(page).to have_no_content('At least one date is required.')
        end
      end
    end

    context 'when searching for collections by Version' do
      before do
        within '#collection-search' do
          select 'Version', from: 'Search Field'
          find(:css, "input[id$='query_text']").set('nasa.001*')

          click_button 'Submit'
        end
      end

      it 'display the correct search results' do
        within '#collection-search-results' do
          expect(page).to have_css('tbody > tr', count: 2)
        end
      end
    end

    context 'when searching for collections by Short Name' do
      before do
        within '#collection-search' do
          select 'Short Name', from: 'Search Field'
          find(:css, "input[id$='query_text']").set('nasa.002*')

          click_button 'Submit'
        end
      end

      it 'display the correct search results' do
        within '#collection-search-results' do
          expect(page).to have_css('tbody > tr', count: 3)
        end
      end
    end

    context 'when searching for collections by Revision Date' do
      before do
        within '#collection-search' do
          select 'Revision Date', from: 'Search Field'
          find(:css, "input[id$='query_date']").set('2017-09-27T00:00:00Z')

          click_button 'Submit'
        end
      end

      it 'displays the correct search results' do
        within '#collection-search-results' do
          expect(page).to have_css('tbody > tr', count: 6)
        end
      end
    end

    context 'when searching for collections by Temporal' do
      before do
        within '#collection-search' do
          select 'Temporal Extent', from: 'Search Field'
          find(:css, "input[id$='query_date_start']").set('2015-05-27T00:00:00Z')
          find(:css, "input[id$='query_date_end']").set('2015-08-27T00:00:00Z')

          click_button 'Submit'
        end
      end

      it 'displays the correct search results' do
        within '#collection-search-results' do
          expect(page).to have_css('tbody > tr', count: 6)
        end
      end
    end

    context 'when adding and removing search criteria' do
      before do
        within '#collection-search' do
          select 'Entry Title', from: 'Search Field'
          find(:css, "input[id$='query_text']").set('*')
          find('.add-search-criteria').click

          within all('fieldset').last do
            select 'Short Name', from: 'Search Field'
            find(:css, "input[id$='query_text']").set('nasa.002*')
          end

          # Remove first search criteria
          within all('fieldset').first do
            find('.remove-search-criteria').click
          end

          click_button 'Submit'
        end
      end

      it 'display the correct search results' do
        within '#collection-search-results' do
          expect(page).to have_css('tbody > tr', count: 3)
        end
      end
    end

    context 'when searching with multiple search criteria' do
      context 'when using multiple text criteria' do
        before do
          within '#collection-search' do
            select 'Version', from: 'Search Field'
            find(:css, "input[id$='query_text']").set('nasa.003*')
            find('.add-search-criteria').click

            within all('fieldset').last do
              select 'Short Name', from: 'Search Field'
              find(:css, "input[id$='query_text']").set('nasa.003*')
            end

            click_button 'Submit'
          end
        end

        it 'display the correct search results' do
          within '#collection-search-results' do
            expect(page).to have_css('tbody > tr', count: 1)
          end
        end
      end

      context 'when using text and date criteria' do
        before do
          within '#collection-search' do
            select 'Version', from: 'Search Field'
            find(:css, "input[id$='query_text']").set('nasa.003*')
            find('.add-search-criteria').click

            within all('fieldset').last do
              select 'Revision Date', from: 'Search Field'
              find(:css, "input[id$='query_date']").set('2017-09-27T00:00:00Z')
            end

            click_button 'Submit'
          end
        end

        it 'display the correct search results' do
          within '#collection-search-results' do
            expect(page).to have_css('tbody > tr', count: 1)
          end
        end
      end

      context 'when a text field is blank' do
        before do
          within '#collection-search' do
            select 'Version', from: 'Search Field'
            find(:css, "input[id$='query_text']").set('nasa.003*')
            find('.add-search-criteria').click

            click_button 'Submit'
          end
        end

        it 'displays an appropriate error message' do
          expect(page).to have_content('Search Term is required.')
        end
      end

      context 'when a temporal field is blank' do
        before do
          within '#collection-search' do
            select 'Version', from: 'Search Field'
            find(:css, "input[id$='query_text']").set('nasa.003*')
            find('.add-search-criteria').click

            within all('fieldset').last do
              select 'Temporal Extent', from: 'Search Field'
            end

            click_button 'Submit'
          end
        end

        it 'displays an appropriate error message' do
          expect(page).to have_content('At least one date is required.', count: 1)
        end
      end
    end
  end
end
