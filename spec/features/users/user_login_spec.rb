require 'rails_helper'

describe 'User login' do
  context 'When logging in with Earthdata Login' do
    before do
      require_urs_login

      real_login(method: 'urs')
    end

    it 'redirects the user to the manage collections page' do
      within 'h2.current' do
        expect(page).to have_content('Manage Collections')
      end

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
          real_login(method: 'urs')
        end

        it 'displays the manage collections page' do
          within 'h2.current' do
            expect(page).to have_content('Manage Collections')
          end
        end
      end
    end

    context 'when the user token is expiring' do
      before do
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
  end

  context 'when logging in with Launchpad' do
    context 'when the user already has an associated URS account' do
      before do
        require_launchpad_login

        real_login(method: 'launchpad')
      end

      it 'redirects the user to the manage collections page' do
        within 'h2.current' do
          expect(page).to have_content('Manage Collections')
        end
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
            real_login(method: 'launchpad')
          end

          it 'displays the manage collections page' do
            within 'h2.current' do
              expect(page).to have_content('Manage Collections')
            end
          end
        end
      end
    end

    context 'when the user does not have an associated URS account' do
      before do
        require_launchpad_login
      end

      context 'when the user successfully logs in with launchpad' do
        before do
          no_linked_account_response = Cmr::Response.new(Faraday::Response.new(status: 404, body: '{"error": "NAMS auid testuser is not associated with a EDL profile"}'))
          allow_any_instance_of(Cmr::UrsClient).to receive(:get_urs_uid_from_nams_auid).and_return(no_linked_account_response)

          real_login(method: 'launchpad', associated: false)
        end

        it 'prompts the user to log into URS to link their accounts' do
          expect(page).to have_content('Redirecting to URS')
          expect(page).to have_content('It appears you do not have a URS account linked with your Launchpad account.')
          expect(page).to have_content('Please click the button below to log in to the URS account you listed on your NAMS request and would like to associate with your Launchpad account.')
          expect(page).to have_link('Earthdata Login')
        end

      end

      context 'when the user returns from logging into URS after prompted to associate an account' do
        before do
          real_login(method: 'launchpad')

          real_login(method: 'urs', making_association: true)
        end

        it 'asks the user to confirm the accounts to be linked' do
          expect(page).to have_content('Confirm URS and Launchpad account association')
          expect(page).to have_content('Please confirm that you want to link this URS account with your Launchpad account.')
          expect(page).to have_content('Launchpad username: testuser')
          expect(page).to have_content('URS username: testuser')
          expect(page).to have_button('Confirm Association')
        end

        context 'when confirming the account association' do
          before do
            linking_accounts_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: '{"msg": "NAMS Id added successfully"}'))
            allow_any_instance_of(Cmr::UrsClient).to receive(:associate_urs_uid_and_auid).and_return(linking_accounts_response)

            click_on 'Confirm Association'
          end

          it 'logs the user in and redirects the user to the manage collections page with a confirmation message' do
            within 'h2.current' do
              expect(page).to have_content('Manage Collections')
            end
            expect(page).to have_content('Your URS and Launchpad accounts were successfully associated!')
          end
        end
      end
    end
  end

  context 'when both Earthdata Login and Launchpad Login requirements are turned off', js: true do
    before do
      set_required_login_method(launchpad_required: false, urs_required: false)

      real_login(method: 'urs')
    end

    it 'redirects the user back to the logged out page displaying an error message and no login button' do
      expect(page).to have_content('ABOUT THE METADATA MANAGEMENT TOOL')
      expect(page).to have_content('ABOUT THE CMR')

      within '.eui-banner--danger' do
        expect(page).to have_content('An error has occurred with our login system. Please contact Earthdata Support.')
        expect(page).to have_link('Earthdata Support', href: 'mailto:support@earthdata.nasa.gov')
      end

      expect(page).to have_no_link('Login', href: login_path)
    end
  end

  context 'when both Earthdata Login and Launchpad Login requirements are turned on', js: true do
    before do
      set_required_login_method(launchpad_required: true, urs_required: true)

      real_login(method: 'urs')
    end

    it 'redirects the user back to the logged out page displaying an error message and no login button' do
      expect(page).to have_content('ABOUT THE METADATA MANAGEMENT TOOL')
      expect(page).to have_content('ABOUT THE CMR')

      within '.eui-banner--danger' do
        expect(page).to have_content('An error has occurred with our login system. Please contact Earthdata Support.')
        expect(page).to have_link('Earthdata Support', href: 'mailto:support@earthdata.nasa.gov')
      end

      expect(page).to have_no_link('Login', href: login_path)
    end
  end
end
