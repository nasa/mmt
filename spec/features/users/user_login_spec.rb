describe 'User login' do
  context 'When proposal mode is turned off' do
    before do
      set_as_mmt_proper
    end

    context 'When logging in with Earthdata Login and it is the only option' do
      before do
        require_urs_login

        real_login(method: 'urs')
      end

      it 'redirects the user to the manage collections page' do
        within 'h2.current' do
          expect(page).to have_content('Manage Collections')
        end

        expect(page).to have_no_content('About the Metadata Management Tool')
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

            expect(page).to have_no_content('About the Metadata Management Tool')
          end
        end
      end

      context 'when the user token is expiring' do
        before do
          make_token_expiring
          visit manage_collections_path
        end

        it 'allows access to the manage collections' do
          expect(page).to have_content('Test User')
          expect(page).to have_content('Logout')
        end

        it 'refreshes the user token' do
          expect(page.get_rack_session_key('access_token')).to eql('new_access_token')
        end
      end

      context 'when the user token is expiring and refreshing the token fails', js: true do
        before do
          make_token_refresh_fail
          visit manage_collections_path
        end

        it 'redirects them to URS to login' do
          expect(page).to have_content('EARTHDATA LOGIN')
        end
      end
    end

    context 'when logging in with Launchpad and it is the only option' do
      context 'when the user already has an associated Earthdata Login account' do
        before do
          require_launchpad_login

          real_login(method: 'launchpad')
        end

        it 'redirects the user to the manage collections page' do
          within 'h2.current' do
            expect(page).to have_content('Manage Collections')
          end

          expect(page).to have_no_content('About the Metadata Management Tool')
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

              expect(page).to have_no_content('About the Metadata Management Tool')
            end
          end
        end
      end

      context 'when the user does not have an associated Earthdata Login account' do
        before do
          require_launchpad_login
        end

        context 'when the user successfully logs in with launchpad' do
          before do
            no_linked_account_response = cmr_fail_response('{"error": "NAMS auid testuser is not associated with a EDL profile"}', 404)
            allow_any_instance_of(Cmr::UrsClient).to receive(:get_urs_uid_from_nams_auid).and_return(no_linked_account_response)

            real_login(method: 'launchpad', associated: false)
          end

          it 'prompts the user to log into Earthdata Login to link their accounts' do
            expect(page).to have_content('Redirecting to Earthdata Login')
            expect(page).to have_content('It appears you do not have a Earthdata Login account linked with your Launchpad account.')
            expect(page).to have_content('Please click the button below to log in to the Earthdata Login account you listed on your NAMS request and would like to associate with your Launchpad account.')
            expect(page).to have_link('Earthdata Login')
          end

        end

        context 'when the user returns from logging into Earthdata Login after prompted to associate an account' do
          before do
            real_login(method: 'launchpad')

            real_login(method: 'urs', making_association: true)
          end

          it 'asks the user to confirm the accounts to be linked' do
            expect(page).to have_content('Confirm Earthdata Login and Launchpad account association')
            expect(page).to have_content('Please confirm that you want to link this Earthdata Login account with your Launchpad account.')
            expect(page).to have_content('Launchpad username: testuser')
            expect(page).to have_content('Earthdata Login username: testuser')
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

              expect(page).to have_content('Your Earthdata Login and Launchpad accounts were successfully associated!')
            end
          end
        end
      end
    end

    context 'when both Earthdata Login and Launchpad Login requirements are turned off', js: true do
      before do
        require_no_login_methods

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

    context 'when both Earthdata Login and Launchpad Login are turned on', js: true do
      context 'when no buttons are hidden' do
        before do
          make_launchpad_button_hidden(false)
          require_launchpad_and_urs_login

          visit '/'
        end

        it 'displays the landing page' do
          expect(page).to have_content('ABOUT THE METADATA MANAGEMENT TOOL')
        end

        it 'displays both login options' do
          expect(page).to have_link('Login with Launchpad', href: login_path(login_method: 'launchpad'))
          expect(page).to have_link('Login with Earthdata Login', href: login_path(login_method: 'urs'))
        end

        context 'when logging in with Earthdata Login' do
          before do
            real_login(method: 'urs')
          end

          it 'redirects the user to the manage collections page' do
            within 'h2.current' do
              expect(page).to have_content('MANAGE COLLECTIONS')
            end

            expect(page).to have_no_content('ABOUT THE METADATA MANAGEMENT TOOL')
          end
        end

        context 'when logging in with Launchpad' do
          before do
            real_login(method: 'launchpad')
          end

          it 'redirects the user to the manage collections page' do
            within 'h2.current' do
              expect(page).to have_content('MANAGE COLLECTIONS')
            end

            expect(page).to have_no_content('ABOUT THE METADATA MANAGEMENT TOOL')
          end
        end
      end

      context 'when the Launchpad button is hidden' do
        # We are hiding the Launchpad button for testing in UAT and PROD when the
        # button hiding is removed and no longer needed, we should remove these tests
        before do
          make_launchpad_button_hidden(true)
          require_launchpad_and_urs_login

          visit '/'
        end

        it 'displays the landing page' do
          expect(page).to have_content('ABOUT THE METADATA MANAGEMENT TOOL')
        end

        it 'displays both login options' do
          expect(page).to have_link('Login with Earthdata Login', href: login_path(login_method: 'urs'))
          expect(page).to have_no_link('Login with Launchpad', href: login_path(login_method: 'launchpad'))
        end

        context 'when logging in with Earthdata Login' do
          before do
            real_login(method: 'urs')
          end

          it 'redirects the user to the manage collections page' do
            within 'h2.current' do
              expect(page).to have_content('MANAGE COLLECTIONS')
            end

            expect(page).to have_no_content('ABOUT THE METADATA MANAGEMENT TOOL')
          end
        end
      end
    end
  end

  context 'when proposal mode is turned on' do
    before do
      set_as_proposal_mode_mmt(with_required_acl: true)
    end

    context 'When logging in with Earthdata Login' do
      before do
        # require_urs_login

        real_login(method: 'urs')
      end

      it 'redirects the user to the manage collection proposals page' do
        within 'h2.current' do
          expect(page).to have_content('Manage Collection Proposals')
        end

        expect(page).to have_no_content('About the Metadata Management Tool')
      end

    end

    context 'when both Earthdata Login and Launchpad Login requirements are turned off', js: true do
      before do
        require_no_login_methods

        real_login(method: 'urs')
      end

      it 'redirects the user back to the logged out page displaying an error message and no login button' do
        expect(page).to have_content('ABOUT THE METADATA MANAGEMENT TOOL FOR NON-NASA USERS')

        within '.eui-banner--danger' do
          expect(page).to have_content('An error has occurred with our login system. Please contact Earthdata Support.')
          expect(page).to have_link('Earthdata Support', href: 'mailto:support@earthdata.nasa.gov')
        end

        expect(page).to have_no_link('Login', href: login_path)
      end
    end
  end
end
