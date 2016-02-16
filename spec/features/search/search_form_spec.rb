# Quick Find and Full Search behavior

require 'rails_helper'

describe 'Search Form', js: true do
  short_name = 'ACR3L2DM'
  entry_title = 'ACRIM III Level 2 Daily Mean Data V001'

  before do
    login
    visit '/search'
  end

  # MMT-300
  context 'when pressing enter to submit a search' do
    context 'when using quick find' do
      before do
        fill_in 'Quick Find', with: short_name
        element = find('input#quick_find_keyword')
        element.native.send_key(:Enter)
      end

      it 'performs the search' do
        expect(page).to have_search_query(1, "Keyword: #{short_name}")
      end
    end

    context 'when using full search' do
      before do
        click_on 'Full Metadata Record Search'
        fill_in 'search_term', with: entry_title
        element = find('input#search_term')
        element.native.send_key(:Enter)
      end

      it 'performs the search' do
        expect(page).to have_search_query(1, "Keyword: #{entry_title}")
      end
    end
  end
end
