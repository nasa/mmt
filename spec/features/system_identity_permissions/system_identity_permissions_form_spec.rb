# MMT-586

require 'rails_helper'

describe 'System Identity Permissions pages and form' do
  # concept_id for Administrators_2 group created on cmr setup
  concept_id = 'AG1200000001-CMR'

  before do
    login(true)
  end

  context 'when visiting the system identities index page' do
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
      end
    end
  end

  context 'when visiting the system identities form for Administrators_2' do
    before do
      visit edit_system_identity_permission_path(concept_id)
    end

    it 'displays the page with the form and table with system targets' do
      expect(page).to have_content('System Object Permissions for Administrators_2')
      expect(page).to have_content("Set permissions for the Administrators_2 group by checking the appropriate boxes below and then clicking 'Save'.")

      within '.system-permissions-table' do
        # loop through all the system targets to check they are in the table
        SystemIdentityPermissionsHelper::SYSTEM_TARGETS.each_with_index do |system_target, index|
          within "tbody > tr:nth-child(#{index + 1})" do
            expect(page).to have_content(system_target)

            SystemIdentityPermissionsHelper::PermissionsOptions.each do |permission_option|
              if SystemIdentityPermissionsHelper.const_get(system_target + '_PERMISSIONS').include?(permission_option)
                if system_target == 'ANY_ACL' || system_target == 'GROUP'
                  # ANY_ACL and GROUP permissions are created on cmr setup
                  expect(page).to have_checked_field("system_permissions[#{system_target}][]", with: permission_option)
                else
                  expect(page).to have_unchecked_field("system_permissions[#{system_target}][]", with: permission_option)
                end
              else
                expect(page).to have_unchecked_field("system_permissions[#{system_target}][]", with: permission_option, readonly: true)
              end
            end
          end
        end
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

    context 'when clicking on unavailable permissions', js: true do
      before do
        check('system_permissions_EXTENDED_SERVICE_', option: 'create')

        check('system_permissions_SYSTEM_INITIALIZER_', option: 'read')
        check('system_permissions_SYSTEM_INITIALIZER_', option: 'update')

        check('system_permissions_TAXONOMY_ENTRY_', option: 'update')
        check('system_permissions_TAXONOMY_ENTRY_', option: 'delete')
      end

      it 'does not make the boxes checked' do
        expect(page).to have_unchecked_field('system_permissions_EXTENDED_SERVICE_', with: 'create')

        expect(page).to have_unchecked_field('system_permissions_SYSTEM_INITIALIZER_', with: 'read')
        expect(page).to have_unchecked_field('system_permissions_SYSTEM_INITIALIZER_', with: 'update')

        expect(page).to have_unchecked_field('system_permissions_TAXONOMY_ENTRY_', with: 'update')
        expect(page).to have_unchecked_field('system_permissions_TAXONOMY_ENTRY_', with: 'delete')
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

      context 'when clicking the Check/Uncheck all box when it is checked', js: true do
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
