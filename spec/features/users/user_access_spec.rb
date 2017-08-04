# MMT-116

require 'rails_helper'

describe 'User Access', js: true do
  context 'when a logged out user tries to view an access restricted page' do
    before do
      visit '/search'
    end

    it 'redirects them to URS for login' do
      expect(page).to have_content 'EARTHDATA LOGIN'
    end
  end

  context 'when a logged in user tries to view an access restricted page' do
    before do
      login
      visit '/search'
    end

    after do
      click_on 'profile-link'
      click_on 'Logout'
    end

    it 'displays the page' do
      expect(page).to have_content 'Search Results'
    end
  end
end
