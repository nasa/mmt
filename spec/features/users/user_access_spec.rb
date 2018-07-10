require 'rails_helper'

describe 'User Access' do
  context 'when Earthdata Login is required' do
    before do
      require_urs_login
    end

    context 'when a logged out user tries to view an access restricted page', js: true do
      before do
        visit search_path
      end

      it 'redirects them to URS to login' do
        expect(page).to have_content('EARTHDATA LOGIN')
      end
    end

    context 'when a logged in user tries to view an access restricted page' do
      before do
        login

        visit search_path
      end

      after do
        visit logout_path
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
        require_launchpad_login

        login

        visit search_path
      end

      after do
        visit logout_path
      end

      it 'displays the page' do
        expect(page).to have_content('Search Results')
      end
    end
  end

  context 'when both URS and Launchpad login methods are available' do
    context 'when a logged out user tries to view an access restricted page' do
      before do
        require_launchpad_and_urs_login

        visit search_path
      end

      after do
        visit logout_path
      end

      it 'redirects the user to the landing page' do
        expect(page).to have_content('About the Metadata Management Tool')
      end

      it 'displays both login options' do
        expect(page).to have_link('Login with Launchpad', href: login_path(login_method: 'launchpad'))
        expect(page).to have_link('Login with URS', href: login_path(login_method: 'urs'))
      end
    end

    context 'when a logged in user tries to view an access restricted page' do
      before do
        require_launchpad_and_urs_login

        login

        visit search_path
      end

      after do
        visit logout_path
      end

      it 'displays the page' do
        expect(page).to have_content('Search Results')
      end
    end
  end
end
