require 'rails_helper'

describe 'User Access', js: true do
  context 'when Earthdata Login is required' do
    context 'when a logged out user tries to view an access restricted page' do
      before do
        require_urs_login

        visit search_path
      end

      it 'redirects them to URS for login' do
        expect(page).to have_content('EARTHDATA LOGIN')
      end
    end

    context 'when a logged in user tries to view an access restricted page' do
      before do
        login

        visit search_path
      end

      after do
        click_on 'profile-link'
        click_on 'Logout'
      end

      it 'displays the page' do
        expect(page).to have_content('Search Results')
      end
    end
  end

  context 'when Launchpad authentication is required' do
    # we cannot test 'when a logged out user tries to view an access restricted page'
    # because launchpad will refuse the connection from the test server
    # so we test it in the controller test

    context 'when a logged in user tries to view an access restricted page' do
      before do
        login

        visit search_path
      end

      after do
        click_on 'profile-link'
        click_on 'Logout'
      end

      it 'displays the page' do
        expect(page).to have_content('Search Results')
      end
    end
  end
end
