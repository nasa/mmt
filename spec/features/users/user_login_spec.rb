# MMT-116, MMT-126

require 'rails_helper'

describe 'User login' do
  context 'When logging in with Earthdata Login' do
    before do
      login
    end

    it 'redirects the user to the dashboard' do
      expect(page).to have_content('Test User')
      expect(page).to have_content('Logout')
    end
    it 'does not display public holdings' do
      expect(page).to have_no_css('table#public-holdings')
    end
  end

  context 'when logging out' do
    before do
      login
      expect(page).to have_content('Logout')
      click_on 'Logout'
    end

    it 'redirects the user to the landing page' do
      expect(page).to have_content('About the Metadata Management Tool')
    end
  end

  context 'when the user token is expiring' do
    before do
      login
      visit_with_expiring_token('/dashboard')
    end

    it 'allows access to the dashboard' do
      expect(page).to have_content('Test User')
      expect(page).to have_content('Logout')
    end

    it 'refreshes the user token' do
      expect(page.get_rack_session_key('access_token')).to eql('new_access_token')
    end
  end
end
