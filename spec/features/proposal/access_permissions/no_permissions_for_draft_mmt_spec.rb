describe 'No Permissions for Non-NASA Draft MMT', reset_provider: true do
  before do
    set_as_proposal_mode_mmt
  end

  context 'when the user does not have Non-NASA Draft User permissions', js: true do
    # These tests cannot use our normal login helper method because it will create
    # an endless redirect cycle. We can use the real login method, which will only
    # work once and normally redirects to the internal landing page and in this
    # mode is the manage collection proposals page. However, the user will be blocked
    # and logged out. Since the real login method will work once, we should mock
    # the internal landing page to be the one we wish to visit

    context 'when visiting the Manage Collection Proposals page' do
      before do
        # the real login method goes to URS, and then by default will redirect
        # to the manage collection proposals page
        real_login(method: 'urs')
      end

      it 'diplays the landing page with the appropriate error message' do
        expect(page).to have_content('ABOUT THE METADATA MANAGEMENT TOOL FOR NON-NASA USERS')
        within 'header.mmt-header' do
          expect(page).to have_content('NON-NASA USERS')
          expect(page).to have_link('Login with Earthdata Login', href: login_path(login_method: 'urs'))

          expect(page).to have_no_link('Login with Launchpad')
        end

        within '.eui-banner--danger' do
          expect(page).to have_content('It appears you are not provisioned with the proper permissions to access the MMT for Non-NASA Users. Please try again or contact Earthdata Support.')
          expect(page).to have_link('Earthdata Support', href: 'mailto:support@earthdata.nasa.gov')
        end
      end
    end

    context 'when visiting the new collection draft proposals page' do
      before do
        allow_any_instance_of(ApplicationController).to receive(:internal_landing_page).and_return(new_collection_draft_proposal_path)

        real_login(method: 'urs')
      end

      it 'diplays the landing page with the appropriate error message' do
        expect(page).to have_content('ABOUT THE METADATA MANAGEMENT TOOL FOR NON-NASA USERS')
        within 'header.mmt-header' do
          expect(page).to have_content('NON-NASA USERS')
          expect(page).to have_link('Login with Earthdata Login', href: login_path(login_method: 'urs'))

          expect(page).to have_no_link('Login with Launchpad')
        end

        within '.eui-banner--danger' do
          expect(page).to have_content('It appears you are not provisioned with the proper permissions to access the MMT for Non-NASA Users. Please try again or contact Earthdata Support.')
          expect(page).to have_link('Earthdata Support', href: 'mailto:support@earthdata.nasa.gov')
        end
      end
    end

    context 'when there are collection draft proposals' do
      before do
        @blocked_collection_draft_proposal = create(:full_collection_draft_proposal)
      end

      context 'when visiting the edit page for a collection draft proposal' do
        before do
          allow_any_instance_of(ApplicationController).to receive(:internal_landing_page).and_return(edit_collection_draft_proposal_path(@blocked_collection_draft_proposal))

          real_login(method: 'urs')
        end

        it 'diplays the landing page with the appropriate error message' do
          expect(page).to have_content('ABOUT THE METADATA MANAGEMENT TOOL FOR NON-NASA USERS')
          within 'header.mmt-header' do
            expect(page).to have_content('NON-NASA USERS')
            expect(page).to have_link('Login with Earthdata Login', href: login_path(login_method: 'urs'))

            expect(page).to have_no_link('Login with Launchpad')
          end

          within '.eui-banner--danger' do
            expect(page).to have_content('It appears you are not provisioned with the proper permissions to access the MMT for Non-NASA Users. Please try again or contact Earthdata Support.')
            expect(page).to have_link('Earthdata Support', href: 'mailto:support@earthdata.nasa.gov')
          end
        end
      end

      context 'when visiting the show page for a collection draft proposal' do
        before do
          allow_any_instance_of(ApplicationController).to receive(:internal_landing_page).and_return(collection_draft_proposal_path(@blocked_collection_draft_proposal))

          real_login(method: 'urs')
        end

        it 'diplays the landing page with the appropriate error message' do
          expect(page).to have_content('ABOUT THE METADATA MANAGEMENT TOOL FOR NON-NASA USERS')
          within 'header.mmt-header' do
            expect(page).to have_content('NON-NASA USERS')
            expect(page).to have_link('Login with Earthdata Login', href: login_path(login_method: 'urs'))

            expect(page).to have_no_link('Login with Launchpad')
          end

          within '.eui-banner--danger' do
            expect(page).to have_content('It appears you are not provisioned with the proper permissions to access the MMT for Non-NASA Users. Please try again or contact Earthdata Support.')
            expect(page).to have_link('Earthdata Support', href: 'mailto:support@earthdata.nasa.gov')
          end
        end
      end
    end
  end
end
