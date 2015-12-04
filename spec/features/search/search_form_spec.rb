# Quick Find and Full Search behavior

require 'rails_helper'

describe 'Search Form', js: true do
  entry_id = 'ACR3L2DM_1'
  entry_title = 'ACRIM III Level 2 Daily Mean Data V001'

  before do
    login
    visit '/search'
  end

  context 'when searching with quick find' do
    before do
      fill_in 'Quick Find', with: entry_id
      click_on 'Find'
      wait_for_ajax
    end

    it 'fills in the full search box with the entry id' do
      click_on 'Full Metadata Record Search'
      expect(page).to have_field('search_term_type', with: 'entry_id')
      expect(page).to have_field('search_term', with: entry_id)

      click_on 'Full Metadata Record Search'
    end

    context 'when clearing the quick find' do
      before do
        fill_in 'Quick Find', with: ''
        click_on 'Find'
        wait_for_ajax
      end

      it 'clears the entry id from the full search' do
        click_on 'Full Metadata Record Search'
        expect(page).to have_no_field('search_term_type', with: 'entry_id')
        expect(page).to have_no_field('search_term', with: entry_id)

        click_on 'Full Metadata Record Search'
      end
    end
  end

  context 'when searching with the full form' do
    before do
      click_on 'Full Metadata Record Search'
      select 'Entry ID', from: 'search_term_type'
      fill_in 'search_term', with: entry_id
      click_on 'Submit'
      wait_for_ajax
    end

    it 'populates the quick find with the entry id' do
      expect(page).to have_field('Quick Find', with: entry_id)
    end

    context 'when clearing the search term' do
      before do
        click_on 'Full Metadata Record Search'
        fill_in 'search_term', with: ''
        click_on 'Submit'
        wait_for_ajax
      end

      it 'clears the quick find field' do
        expect(page).to have_no_field('Quick Find', with: entry_id)
      end
    end
  end

  # MMT-300
  context 'when pressing enter to submit a search' do
    context 'when using quick find' do
      before do
        fill_in 'Quick Find', with: entry_id
        element = find('input#entry_id')
        element.native.send_key(:Enter)
      end

      it 'performs the search' do
        expect(page).to have_search_query(1, "Entry Id: #{entry_id}")
      end
    end
    context 'when using full search' do
      before do
        click_on 'Full Metadata Record Search'
        select 'Entry Title', from: 'search_term_type'
        fill_in 'search_term', with: entry_title
        element = find('input#search_term')
        element.native.send_key(:Enter)
      end

      it 'performs the search' do
        expect(page).to have_search_query(1, "Entry Title: #{entry_title}")
      end
    end
  end

end
