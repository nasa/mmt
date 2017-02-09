# MMT-586

require 'rails_helper'

describe 'System Identity Permissions pages and form' do
  # concept_id for Administrators_2 group created on cmr setup
  # let(:concept_id) { 'AG1200000001-CMR' }

  before :all do
    @group_name = random_group_name
    group_description = random_group_description
    @group = create_group(
      name: @group_name,
      description: group_description,
      provider_id: nil,
      admin: true
    )
    # default management group for create_group is 'Administrators_2'

    wait_for_cmr

    @managed_group_name = random_group_name
    managed_group_description = random_group_description

    @managed_group = create_group(
      name: @managed_group_name,
      description: managed_group_description,
      provider_id: nil, # System Level groups do not have a provider_id
      management_group: @group['concept_id'],
      admin: true
    )

    wait_for_cmr
  end

  after :all do
    # System level groups need to be cleaned up to avoid attempting to create
    # a group with the same name in another test (Random names don't seem to be reliable)
    delete_group(concept_id: @group['concept_id'], admin: true)
    delete_group(concept_id: @managed_group['concept_id'], admin: true)
  end

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
          visit system_identity_permissions_path
        end

        it 'shows the page with table of system level groups' do
          expect(page).to have_content('System Object Permissions')
          expect(page).to have_content('Click on a System Group to access the system object permissions for that group.')

          within '.system-group-table' do
            # these are the bootstrapped CMR Administrators group, and the system groups we create on cmr setup
            expect(page).to have_content('Administrators')
            expect(page).to have_content('Administrators_2')
            expect(page).to have_content('MMT Admins')
            expect(page).to have_content('MMT Users')
            expect(page).to have_content(@group_name)
            expect(page).to have_content(@managed_group_name)
          end
        end
      end

      context 'when no system groups are returned' do
        before do
          failure = '{"errors":["An Internal Error has occurred."]}'
          failure_response = Cmr::Response.new(Faraday::Response.new(status: 500, body: JSON.parse(failure)))
          allow_any_instance_of(Cmr::CmrClient).to receive(:get_cmr_groups).and_return(failure_response)

          visit system_identity_permissions_path
        end

        it 'does not show any groups' do
          expect(page).to have_content('There are no System Groups available at this time or you do not have permissions to see System Groups.')
        end
      end
    end

    context 'when visiting the system identities form for the System Group that manages another group' do
      before do
        visit edit_system_identity_permission_path(@group['concept_id'])
      end

      it 'displays the page with the form and table of system and group management targets' do
        expect(page).to have_content("#{@group_name} System Object Permissions")
        expect(page).to have_content("Set permissions for the #{@group_name} group by checking the appropriate boxes below and clicking 'Submit'.")

        within '.system-permissions-table' do
          expect(page).to have_css('tbody > tr', count: (SystemIdentityPermissionsHelper::SYSTEM_TARGETS.count + 1))
          expect(page).to have_css('input[type=checkbox]', count: 96) # all checkboxes
          expect(page).to have_css('input[type=checkbox][checked]', count: 2)
          expect(page).to have_css('input[type=checkbox][disabled]', count: 56)
          expect(page).to have_css('input[type=checkbox]:not([disabled])', count: 40)
          expect(page).to have_css('input[type=checkbox]:not([checked])', count: 94)

          expect(page).to have_content("Group Management for [#{@managed_group_name}]")
        end
      end

      it 'displays the checked single instance identity group management permissions' do
        expect(page).to have_checked_field("group_management_#{@managed_group['concept_id']}_", with: 'update')
        expect(page).to have_checked_field("group_management_#{@managed_group['concept_id']}_", with: 'delete')
      end
    end

    context 'when visiting the system identities form for the System Group that does not manage another group' do
      before do
        visit edit_system_identity_permission_path(@managed_group['concept_id'])
      end

      it 'displays the form and table of system targets' do
        expect(page).to have_content("#{@managed_group_name} System Object Permissions")
        expect(page).to have_content("Set permissions for the #{@managed_group_name} group by checking the appropriate boxes below and clicking 'Submit'.")

        within '.system-permissions-table' do
          expect(page).to have_css('tbody > tr', count: SystemIdentityPermissionsHelper::SYSTEM_TARGETS.count)
          expect(page).to have_css('input[type=checkbox]', count: 92) # all checkboxes
          expect(page).to have_css('input[type=checkbox][checked]', count: 0)
          expect(page).to have_css('input[type=checkbox][disabled]', count: 54)
          expect(page).to have_css('input[type=checkbox]:not([disabled])', count: 38)
          expect(page).to have_css('input[type=checkbox]:not([checked])', count: 92)

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
            expect(page).to have_css('input[type=checkbox]:checked', count: 38)
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
