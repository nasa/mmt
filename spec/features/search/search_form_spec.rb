# Quick Find and Full Search behavior

require 'rails_helper'

describe 'Search Form', js: true do
  entry_id = 'doi:10.3334/ORNLDAAC/8_1'

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
      expect(page).to have_field('search-term-type', with: 'entry-id')
      expect(page).to have_field('search-term', with: entry_id)

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
        expect(page).to have_no_field('search-term-type', with: 'entry-id')
        expect(page).to have_no_field('search-term', with: entry_id)

        click_on 'Full Metadata Record Search'
      end
    end
  end

  context 'when searching with the full form' do
    before do
      click_on 'Full Metadata Record Search'
      select 'Entry ID', from: 'search-term-type'
      fill_in 'search-term', with: entry_id
      click_on 'Submit'
      wait_for_ajax
    end

    it 'populates the quick find with the entry id' do
      expect(page).to have_field('Quick Find', with: entry_id)
    end

    context 'when clearing the search term' do
      before do
        click_on 'Full Metadata Record Search'
        fill_in 'search-term', with: ''
        click_on 'Submit'
        wait_for_ajax
      end

      it 'clears the quick find field' do
        expect(page).to have_no_field('Quick Find', with: entry_id)
      end
    end
  end
end
