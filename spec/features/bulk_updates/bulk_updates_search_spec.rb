require 'rails_helper'

describe 'Searching collections to bulk update', reset_provider: true do
  before(:all) do
    # Create a few collections with unique attributes that we can search for
    2.times { |i| publish_draft(version: "nasa.001#{i}") }
    3.times { |i| publish_draft(short_name: "nasa.002#{i}") }
  end

  context 'when viewing the bulk update search page' do
    before do
      login

      visit new_bulk_updates_search_path
    end

    it 'displays the correct number of options for search field' do
      within '#bulk-updates-search' do
        expect(page).to have_css('select[name="field"] option', count: BulkUpdatesHelper::SEARCHABLE_KEYS.count)
      end
    end

    it 'displays the correct options for the search field' do
      within '#bulk-updates-search' do
        options = BulkUpdatesHelper::SEARCHABLE_KEYS.map { |key, value| value[:title] }

        expect(page).to have_select('field', options: options)
      end
    end

    context 'when clicking submit without a search query', js: true do
      before do
        within '#bulk-updates-search' do
          click_button 'Submit'
        end
      end

      it 'displays an appropriate error message' do
        expect(page).to have_content('Search Term is required.')
      end
    end

    context 'when searching for collections by Version' do
      before do
        within '#bulk-updates-search' do
          select 'Version', from: 'Search Field'
          fill_in 'query', with: 'nasa.001*'

          click_button 'Submit'
        end
      end

      it 'display the correct search results' do
        within '#bulk-updates-search-results' do
          expect(page).to have_css('tbody > tr', count: 2)
        end
      end
    end

    context 'when searching for collections by Short Name' do
      before do
        within '#bulk-updates-search' do
          select 'Short Name', from: 'Search Field'
          fill_in 'query', with: 'nasa.002*'

          click_button 'Submit'
        end
      end

      it 'display the correct search results' do
        within '#bulk-updates-search-results' do
          expect(page).to have_css('tbody > tr', count: 3)
        end
      end
    end
  end
end
