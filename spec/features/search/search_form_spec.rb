# Quick Find and Full Search behavior

require 'rails_helper'

describe 'Search Form', js: true do
  short_name = 'ACR3L2DM'
  entry_title = 'ACRIM III Level 2 Daily Mean Data V001'

  before do
    login
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
        fill_in 'full_search_term', with: entry_title
        element = find('input#full_search_term')
        element.native.send_key(:Enter)
      end

      it 'performs the search' do
        expect(page).to have_search_query(1, "Keyword: #{entry_title}")
      end
    end
  end

  context 'opening the full search form' do
    before do
      click_on 'Full Metadata Record Search'
    end

    it 'has the full search form elements' do
      expect(page).to have_css("input[type='radio'][value='published_records']")
      expect(page).to have_css("input[type='radio'][value='draft_records']")
      expect(page).to have_css('select#provider_id')
      expect(page).to have_css("input[type='text'][name='full_search_term']")
    end
  end
end
