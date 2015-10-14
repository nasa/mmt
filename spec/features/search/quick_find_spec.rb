# MMT-9, MMT-22

require 'rails_helper'

describe 'Quick find search', js: true do
  entry_id = 'doi:10.3334/ORNLDAAC/8_1'

  before do
    login
  end

  context 'when not viewing the search page' do
    context 'and performing a quick find search' do
      before do
        visit '/dashboard'
        fill_in 'entry_id', with: entry_id
        click_on 'Find'
      end

      it 'redirects the user to the search page' do
        expect(page).to have_content('Search Result')
      end

      it 'displays collection results' do
        expect(page).to have_search_query(1, "Entry Id: #{entry_id}")
      end
    end
  end

  context 'when viewing the search page' do
    before do
      visit '/search'
      fill_in 'entry_id', with: entry_id
      click_on 'Find'
    end

    it 'keeps the user on the search page' do
      expect(page).to have_content('Search Result')
    end

    it 'displays collection results' do
      expect(page).to have_search_query(1, "Entry Id: #{entry_id}")
    end
  end

  context 'When on the home page' do
    before do
      visit '/'
    end

    it 'there is no Quick Find option' do
      expect(page).not_to have_button('quick_find_button')
    end
  end
end
