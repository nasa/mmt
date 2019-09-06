describe 'Welcome Page' do
  context 'when proposal mode is turned off' do
    before do
      set_as_mmt_proper
    end

    context 'when Earthdata Login is required' do
      before do
        require_urs_login
      end

      context 'when a logged out user tries to visit the landing page' do
        before do
          visit root_path
        end

        it 'displays the landing page with the correct info' do
          expect(page).to have_content('About the Metadata Management Tool')
          expect(page).to have_content('About the CMR')

          within 'header.mmt-header' do
            expect(page).to have_link('Login with Earthdata Login', href: login_path(login_method: 'urs'))

            expect(page).to have_no_link('Login with Launchpad')
            expect(page).to have_no_content('Non-NASA Users')
          end
        end
      end
    end

    context 'when Launchpad authentication is required' do
      before do
        require_launchpad_login
      end

      context 'when a logged out user tries to visit the landing page' do
        before do
          visit root_path
        end

        it 'displays the landing page with the correct info' do
          expect(page).to have_content('About the Metadata Management Tool')
          expect(page).to have_content('About the CMR')

          within 'header.mmt-header' do
            expect(page).to have_link('Login with Launchpad', href: login_path(login_method: 'launchpad'))

            expect(page).to have_no_link('Login with Earthdata Login')
            expect(page).to have_no_content('Non-NASA Users')
          end
        end
      end
    end

    context 'when both URS and Launchpad login methods are available' do
      before do
        require_launchpad_and_urs_login
      end

      context 'when a logged out user tries to visit the landing page' do
        before do
          visit root_path
        end

        it 'displays the landing page with the correct info' do
          expect(page).to have_content('About the Metadata Management Tool')
          expect(page).to have_content('About the CMR')

          within 'header.mmt-header' do
            expect(page).to have_link('Login with Launchpad', href: login_path(login_method: 'launchpad'))
            expect(page).to have_link('Login with Earthdata Login', href: login_path(login_method: 'urs'))

            expect(page).to have_no_content('Non-NASA Users')
          end
        end
      end
    end
  end

  context 'when proposal_mode is turned on' do
    before do
      set_as_proposal_mode_mmt
    end

    context 'when a logged out user tries to visit the landing page' do
      before do
        visit root_path
      end

      it 'displays the landing page with the correct info' do
        expect(page).to have_content('About the Metadata Management Tool for Non-NASA Users')

        expect(page).to have_no_content('About the CMR')

        within 'header.mmt-header' do
          expect(page).to have_content('Non-NASA Users')
          expect(page).to have_link('Login with Earthdata Login', href: login_path(login_method: 'urs'))

          expect(page).to have_no_link('Login with Launchpad')
        end
      end
    end
  end
end
