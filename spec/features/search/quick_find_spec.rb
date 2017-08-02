# MMT-9, MMT-22

require 'rails_helper'

describe 'Quick find search', js: true do
  let(:short_name) { 'MIRCCMF' }
  before do
    login
  end

  context 'when not viewing the search page' do
    context 'and performing a quick find search' do
      before do
        visit manage_collections_path
        fill_in 'Quick Find', with: short_name
        click_on 'Find'
      end

      it 'redirects the user to the search page' do
        expect(page).to have_content('Search Result')
      end

      it 'displays collection results' do
        expect(page).to have_search_query(1, "Keyword: #{short_name}")
      end
    end
  end

  context 'when viewing the search page' do
    before do
      visit search_path
      fill_in 'Quick Find', with: short_name
      click_on 'Find'
    end

    it 'keeps the user on the search page' do
      expect(page).to have_content('Search Result')
    end

    it 'displays collection results' do
      expect(page).to have_search_query(1, "Keyword: #{short_name}")
    end
  end

  context 'When on the home page' do
    before do
      visit root_url
    end

    it 'there is no Quick Find option' do
      expect(page).not_to have_button('quick_find_button')
    end
  end
end
