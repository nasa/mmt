# MMT-116, MMT-126

require 'rails_helper'

describe 'User login' do
  context 'When logging in with Earthdata Login' do
    before do
      real_login
    end

    it 'redirects the user to the manage collections page' do
      within 'h2.current' do
        expect(page).to have_content('Manage Collections')
      end
    end

    it 'does not display public holdings' do
      expect(page).to have_no_css('table#public-holdings')
    end

    context 'when logging out' do
      before do
        visit collection_drafts_path
        click_on 'Logout'
      end

      it 'redirects the user to the landing page' do
        expect(page).to have_content('About the Metadata Management Tool')
      end

      context 'when the user logs back in' do
        before do
          real_login
        end

        it 'displays the manage collections page' do
          within 'h2.current' do
            expect(page).to have_content('Manage Collections')
          end
        end
      end
    end
  end

  context 'when the user token is expiring' do
    before do
      real_login
      visit_with_expiring_token('/manage_collections')
    end

    it 'allows access to the manage collections' do
      expect(page).to have_content('Test User')
      expect(page).to have_content('Logout')
    end

    it 'refreshes the user token' do
      expect(page.get_rack_session_key('access_token')).to eql('new_access_token')
    end
  end

  context 'when both Earthdata Login and Launchpad Login requirements are turned off', js: true do
    before do
      allow_any_instance_of(ApplicationController).to receive(:urs_login_required?).and_return(false)

      real_login
    end

    it 'redirects the user back to the logged out page with the appropriate error message' do
      expect(page).to have_content('ABOUT THE METADATA MANAGEMENT TOOL')
      expect(page).to have_content('ABOUT THE CMR')

      expect(page).to have_no_link('Earthdata Login', href: login_path)

      within '.eui-banner--danger' do
        expect(page).to have_content('An error has occurred with our login system. Please contact Earthdata Support.')
        expect(page).to have_link('Earthdata Support', href: 'mailto:support@earthdata.nasa.gov')
      end
    end
  end
end
