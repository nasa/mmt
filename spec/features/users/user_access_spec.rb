describe 'User Access' do
  context 'when proposal mode is turned off' do
    before do
      set_as_mmt_proper
    end

    context 'when Earthdata Login is required' do
      before do
        require_urs_login
      end

      context 'when a user is logged out' do
        before do
          visit logout_path
        end

        context 'when a logged out user tries to view an access restricted page', js: true do
          before do
            visit search_path
          end

          it 'redirects them to Earthdata Login to log in' do
            expect(page).to have_content('EARTHDATA LOGIN')
          end
        end

        context 'when a logged out user tries to view a proposals page', js: true do
          before do
            visit manage_collection_proposals_path
          end

          # Todo: Fix issue with test failing.
          # This is failing in the newer chrome driver, not sure why yet.
          it 'redirects them to Earthdata Login to log in', skip:true do
            expect(page).to have_content('EARTHDATA LOGIN')
          end
        end
      end

      context 'when a user is logged in' do
        before do
          login
        end

        context 'when a logged in user tries to view an access restricted page' do
          before do
            visit search_path
          end

          it 'displays the page' do
            expect(page).to have_content('Search Results')
          end
        end

        context 'when a logged in user tries to view a proposals page' do
          before do
            visit manage_collection_proposals_path
          end

          it 'redirects to the manage collections page' do
            within 'main header' do
              expect(page).to have_css('h2.current', text: 'Manage Collections')
              expect(page).to have_content('Manage Variables')
              expect(page).to have_content('Manage Services')
              expect(page).to have_content('Manage CMR')
            end
          end
        end

        context 'when a logged in user visits the welcome page' do
          before do
            visit root_url
          end

          it 'redirects to the manage collections page' do
            within 'main header' do
              expect(page).to have_css('h2.current', text: 'Manage Collections')
              expect(page).to have_content('Manage Variables')
              expect(page).to have_content('Manage Services')
              expect(page).to have_content('Manage CMR')
            end
          end
        end
      end

    end

    context 'when Launchpad authentication is required' do
      # we cannot test 'when a logged out user tries to view an access restricted page'
      # because launchpad will refuse the connection from the test server
      # so we test it in the controller test

      context 'when a user is logged in' do
        before do
          require_launchpad_login

          login
        end

        context 'when a logged in user tries to view an access restricted page' do
          before do
            visit search_path
          end

          it 'displays the page' do
            expect(page).to have_content('Search Results')
          end
        end

        context 'when a logged in user tries to view a proposals page' do
          before do
            visit manage_collection_proposals_path
          end

          it 'redirects to the manage collections page' do
            within 'main header' do
              expect(page).to have_css('h2.current', text: 'Manage Collections')
              expect(page).to have_content('Manage Variables')
              expect(page).to have_content('Manage Services')
              expect(page).to have_content('Manage CMR')

              expect(page).to have_no_content('Manage Collection Proposals')
            end
          end
        end

        context 'when a logged in user visits the welcome page' do
          before do
            visit root_url
          end

          it 'redirects to the manage collections page' do
            within 'main header' do
              expect(page).to have_css('h2.current', text: 'Manage Collections')
              expect(page).to have_content('Manage Variables')
              expect(page).to have_content('Manage Services')
              expect(page).to have_content('Manage CMR')
            end
          end
        end
      end
    end

    context 'when both URS and Launchpad login methods are available' do
      before do
        require_launchpad_and_urs_login
      end

      context 'when a user is logged out' do
        before do
          visit logout_path
        end

        context 'when a logged out user tries to view an access restricted page' do
          before do
            visit search_path
          end

          it 'redirects the user to the landing page' do
            expect(page).to have_content('About the Metadata Management Tool')
          end

          it 'displays both login options' do
            expect(page).to have_link('Login with Launchpad', href: login_path(login_method: 'launchpad'))
            expect(page).to have_link('Login with Earthdata Login', href: login_path(login_method: 'urs'))
          end
        end
      end

      context 'when a user is logged in' do
        before do
          login
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
  end

  context 'when proposal_mode is turned on' do
    before do
      set_as_proposal_mode_mmt(with_required_acl: true)
    end

    context 'when a user is logged out' do
      before do
        visit logout_path
      end

      context 'when a logged out user tries to view an access restricted page', js: true do
        before do
          visit manage_collection_proposals_path
        end

        it 'redirects them to Earthdata Login to log in' do
          expect(page).to have_content('EARTHDATA LOGIN')
        end
      end
    end

    context 'when a user is logged in' do
      before do
        login
      end

      context 'when a logged in user tries to view the manage collection proposals page' do
        before do
          visit manage_collection_proposals_path
        end

        it 'displays manage collection proposals page' do
          within 'main header' do
            expect(page).to have_css('h2.current', text: 'Manage Collection Proposals')
            expect(page).to have_no_content('Manage Collections')
            expect(page).to have_no_content('Manage Variables')
            expect(page).to have_no_content('Manage Services')
            expect(page).to have_no_content('Manage CMR')
          end
        end
      end

      context 'when a logged in user tries to view a MMT proper page' do
        before do
          login

          visit manage_variables_path
        end

        after do
          visit logout_path
        end

        it 'redirects to the manage collection proposals page' do
          within 'main header' do
            expect(page).to have_css('h2.current', text: 'Manage Collection Proposals')
            expect(page).to have_no_content('Manage Collections')
            expect(page).to have_no_content('Manage Variables')
            expect(page).to have_no_content('Manage Services')
            expect(page).to have_no_content('Manage CMR')
          end
        end
      end

      context 'when a logged in user visits the welcome page' do
        before do
          visit root_url
        end

        it 'redirects to the manage collection proposals page' do
          within 'main header' do
            expect(page).to have_css('h2.current', text: 'Manage Collection Proposals')
            expect(page).to have_no_content('Manage Collections')
            expect(page).to have_no_content('Manage Variables')
            expect(page).to have_no_content('Manage Services')
            expect(page).to have_no_content('Manage CMR')
          end
        end
      end
    end
  end
end
