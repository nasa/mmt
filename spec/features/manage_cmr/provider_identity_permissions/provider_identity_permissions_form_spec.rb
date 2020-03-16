describe 'Provider Identity Permissions pages and form', reset_provider: true do
  before :all do
    @group_name = 'Test Group for Provider Object Permissions'
    @group_description = 'Group for provider object permissions management'

    @group = create_group(
      name: @group_name,
      description: @group_description
    )

    wait_for_cmr
  end

  context 'when viewing the provider identities permisisons index page as an administrator' do
    before do
      login_admin

      visit provider_identity_permissions_path
    end

    it 'shows the table with system and provider groups' do
      within '.provider-permissions-group-table' do
        expect(page).to have_content(@group_name)

        # these are the bootstrapped CMR Administrators group, and the system groups we create on cmr setup
        expect(page).to have_content('Administrators')
        expect(page).to have_content('Administrators_2')
        expect(page).to have_content('MMT_2 Admin Group')
      end
    end
  end


  context 'when visiting the provider identities permissions pages as a regular user' do
    before do
      login
    end

    context 'when there are groups' do
      before do
        visit provider_identity_permissions_path
      end

      it 'shows the table with the provider group' do
        expect(page).to have_content('Provider Object Permissions')
        expect(page).to have_content('Click on a Group to access the provider object permissions for that group.')

        within '.provider-permissions-group-table' do
          expect(page).to have_content("#{@group_name} #{@group_description} MMT_2 0")
        end
      end
    end

    context 'when no groups are returned' do
      before do
        failure = '{"errors":["An Internal Error has occurred."]}'
        failure_response = Cmr::Response.new(Faraday::Response.new(status: 500, body: JSON.parse(failure), response_headers: {}))
        allow_any_instance_of(Cmr::CmrClient).to receive(:get_cmr_groups).and_return(failure_response)

        visit provider_identity_permissions_path
      end

      it 'does not show any groups' do
        expect(page).to have_content('There are no Provider Groups available at this time or you do not have the right permissions.')
      end
    end

    context 'when visiting the provider identities form for the group' do
      before do
        visit edit_provider_identity_permission_path(@group['concept_id'])
      end

      it 'displays the page with the form and table of provider targets' do
        expect(page).to have_content("#{@group_name} Provider Object Permissions")
        expect(page).to have_content("Set permissions for the #{@group_name} group by checking the appropriate boxes below and clicking 'Submit'.")

        within '.provider-permissions-table' do
          expect(page).to have_css('tbody > tr', count: ProviderIdentityPermissionsHelper::PROVIDER_TARGETS.count)
          expect(page).to have_css('input[type=checkbox]', count: 116) # all checkboxes
          expect(page).to have_css('input[type=checkbox][checked]', count: 0)
          expect(page).to have_css('input[type=checkbox][disabled]', count: 54)
          expect(page).to have_css('input[type=checkbox]:not([disabled])', count: 62)
          expect(page).to have_css('input[type=checkbox]:not([checked])', count: 116)

          expect(page).to have_no_content('Group Management for')
        end
      end

      context 'when clicking on available permissions' do
        before do
          check('provider_permissions_GROUP_', option: 'read')
          check('provider_permissions_INGEST_MANAGEMENT_ACL_', option: 'update')
          check('provider_permissions_OPTION_DEFINITION_', option: 'create')
          check('provider_permissions_PROVIDER_POLICIES_', option: 'delete')
        end

        it 'checks the permissions' do
          expect(page).to have_checked_field('provider_permissions_GROUP_', with: 'read')
          expect(page).to have_checked_field('provider_permissions_INGEST_MANAGEMENT_ACL_', with: 'update')
          expect(page).to have_checked_field('provider_permissions_OPTION_DEFINITION_', with: 'create')
          expect(page).to have_checked_field('provider_permissions_PROVIDER_POLICIES_', with: 'delete')
        end
      end

      context 'when clicking the Check/Uncheck all box when it is unchecked', js: true do
        before do
          check('provider_acls_select_all')
        end

        it 'checks all the available permissions checkboxes' do
          within '.provider-permissions-table' do
            expect(page).to have_css('input[type=checkbox]:checked', count: 62)
          end
        end

        context 'when clicking the Check/Uncheck all box when it is checked' do
          before do
            uncheck('provider_acls_select_all')
          end

          it 'unchecks all the boxes' do
            within '.provider-permissions-table' do
              expect(page).to have_css('input[type=checkbox]:checked', count: 0)
            end
          end
        end
      end
    end
  end
end
