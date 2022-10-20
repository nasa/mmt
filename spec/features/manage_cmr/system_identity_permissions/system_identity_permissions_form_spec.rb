# EDL Failed Test
describe 'System Identity Permissions pages and form', skip:true do
  # concept_id for Administrators_2 group created on cmr setup
  let(:concept_id) { group_concept_from_name('Administrators_2', 'access_token_admin') }

  context 'when logging in as a regular user' do
    before do
      login
    end

    context 'when visiting the Manage CMR page' do
      before do
        visit manage_cmr_path
      end

      it 'does not show the System Object Permissions link' do
        expect(page).to have_no_link('System Object Permissions')
      end
    end
  end

  context 'when logging in as an administrator' do
    before do
      login_admin
    end

    context 'when visiting the system identities index page' do
      context 'when there are system groups' do
        before do
          VCR.use_cassette('edl', record: :new_episodes) do
            visit system_identity_permissions_path
          end
        end

        it 'shows the page with table of system level groups' do
          expect(page).to have_content('System Object Permissions')
          expect(page).to have_content('Click on a System Group to access the system object permissions for that group.')

          within '.system-permissions-group-table' do
            # these are the bootstrapped CMR Administrators group, and the system groups we create on cmr setup
            expect(page).to have_content('Administrators')
            expect(page).to have_content('Administrators_2')
          end
        end
      end

      context 'when no system groups are returned' do
        before do
          failure = '{"errors":["An Internal Error has occurred."]}'
          failure_response = Cmr::Response.new(Faraday::Response.new(status: 500, body: JSON.parse(failure), response_headers: {}))
          allow_any_instance_of(Cmr::UrsClient).to receive(:get_edl_groups).and_return(failure_response)

          VCR.use_cassette('edl', record: :new_episodes) do
            visit system_identity_permissions_path
          end
        end

        it 'does not show any groups' do
          expect(page).to have_content('There are no System Groups available at this time or you do not have permissions to see System Groups.')
        end
      end
    end

    context 'when visiting the system identities form for a System Group' do
      before do
        VCR.use_cassette('edl', record: :new_episodes) do
          visit edit_system_identity_permission_path(concept_id)
        end
      end

      it 'displays the form and table of system targets' do
        expect(page).to have_content('Administrators_2 System Object Permissions')
        expect(page).to have_content("Set permissions for the Administrators_2 group by checking the appropriate boxes below and clicking 'Submit'.")

        within '.system-permissions-table' do
          expect(page).to have_css('tbody > tr', count: SystemIdentityPermissionsHelper::SYSTEM_TARGETS.count)
          expect(page).to have_css('input[type=checkbox]', count: 104) # all checkboxes
          expect(page).to have_css('input[type=checkbox][checked]', count: 6) # Administrators_2 should have ANY_ACL and GROUP permissions
          expect(page).to have_css('input[type=checkbox][disabled]', count: 54)
          expect(page).to have_css('input[type=checkbox]:not([disabled])', count: 50)
          expect(page).to have_css('input[type=checkbox]:not([checked])', count: 98)

          expect(page).to have_no_content('Group Management for')
        end
      end

      context 'when clicking on available permissions' do
        before do
          check('system_permissions_PROVIDER_', option: 'create')
          check('system_permissions_PROVIDER_', option: 'delete')
          check('system_permissions_SYSTEM_AUDIT_REPORT_', option: 'read')
          check('system_permissions_TAXONOMY_', option: 'create')
          check('system_permissions_USER_', option: 'update')
        end

        it 'checks the permissions' do
          expect(page).to have_checked_field('system_permissions_PROVIDER_', with: 'create')
          expect(page).to have_checked_field('system_permissions_PROVIDER_', with: 'delete')
          expect(page).to have_checked_field('system_permissions_SYSTEM_AUDIT_REPORT_', with: 'read')
          expect(page).to have_checked_field('system_permissions_TAXONOMY_', with: 'create')
          expect(page).to have_checked_field('system_permissions_USER_', with: 'update')
        end
      end

      context 'when clicking the Check/Uncheck all box when it is unchecked', js: true do
        before do
          check('system_acls_select_all')
        end

        it 'checks all the available permissions checkboxes' do
          within '.system-permissions-table' do
            expect(page).to have_css('input[type=checkbox]:checked', count: 50)
          end
        end

        context 'when clicking the Check/Uncheck all box when it is checked' do
          before do
            uncheck('system_acls_select_all')
          end

          it 'unchecks all the checkboxes' do
            within '.system-permissions-table' do
              expect(page).to have_css('input[type=checkbox]:checked', count: 0)
            end
          end
        end
      end
    end
  end
end
