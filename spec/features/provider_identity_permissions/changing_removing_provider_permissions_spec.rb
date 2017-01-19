# MMT-582

require 'rails_helper'

describe 'Changing or Removing Provider Identity Permissions', reset_provider: true do
  before :all do
    @group = create_group(
      name: 'Test Group for Updating Provider Object Permissions',
      description: 'Group for updating provider object permissions'
    )

    wait_for_cmr

    @managed_group_name = 'Managed Group for Provider Object Permissions'
    @managed_group = create_group(
      name: @managed_group_name,
      description: 'Group 2 for provider object permissions management',
      management_group: @group['concept_id']
    )

    wait_for_cmr

    provider_perm_1 = {
      'group_permissions' => [{
        'group_id' => @group['concept_id'],
        'permissions' => ['read']
      }],
      'provider_identity' => {
        'target' => 'OPTION_ASSIGNMENT',
        'provider_id' => 'MMT_2'
      }
    }

    provider_perm_2 = {
      'group_permissions' => [{
        'group_id' => @group['concept_id'],
        'permissions' => ['update']
      }],
      'provider_identity' => {
        'target' => 'PROVIDER_ORDER_TRACKING_ID',
        'provider_id' => 'MMT_2'
      }
    }

    provider_perm_3 = {
      'group_permissions' => [{
        'group_id' => @group['concept_id'],
        'permissions' => ['create', 'delete']
      }],
      'provider_identity' => {
        'target' => 'AUTHENTICATOR_DEFINITION',
        'provider_id' => 'MMT_2'
      }
    }

    permissions = [provider_perm_1, provider_perm_2, provider_perm_3]
    permissions.each { |perm| cmr_client.add_group_permissions(perm, 'access_token') }

    wait_for_cmr
  end

  context 'when visiting the provider object permissions page for the group that manages another group' do
    before do
      login

      visit edit_provider_identity_permission_path(@group['concept_id'])
    end

    it 'has the correct permissions checked' do
      expect(page).to have_checked_field('provider_permissions_OPTION_ASSIGNMENT_', with: 'read')
      expect(page).to have_checked_field('provider_permissions_PROVIDER_ORDER_TRACKING_ID_', with: 'update')
      expect(page).to have_checked_field('provider_permissions_AUTHENTICATOR_DEFINITION_', with: 'create')
      expect(page).to have_checked_field('provider_permissions_AUTHENTICATOR_DEFINITION_', with: 'delete')
    end

    it 'has the single instance identity group management permissions checked' do
      expect(page).to have_checked_field("group_management_#{@managed_group['concept_id']}_", with: 'update')
      expect(page).to have_checked_field("group_management_#{@managed_group['concept_id']}_", with: 'delete')
    end

    context 'when changing and removing provider permissions' do
      before do
        uncheck('provider_permissions_AUTHENTICATOR_DEFINITION_', option: 'delete')
        uncheck('provider_permissions_PROVIDER_ORDER_TRACKING_ID_', option: 'update')
        uncheck('provider_permissions_OPTION_ASSIGNMENT_', option: 'read')
        
        uncheck("group_management_#{@managed_group['concept_id']}_", option: 'update')
        uncheck("group_management_#{@managed_group['concept_id']}_", option: 'delete')

        check('provider_permissions_OPTION_ASSIGNMENT_', option: 'delete')
        check('provider_permissions_INGEST_MANAGEMENT_ACL_', option: 'read')
        check('provider_permissions_OPTION_DEFINITION_', option: 'create')
        check('provider_permissions_PROVIDER_POLICIES_', option: 'update')

        within '.provider-permissions-form' do
          click_on 'Submit'
        end

        wait_for_cmr
      end

      it 'displays a success message and no error message on the index page' do
        expect(page).to have_content('Provider Object Permissions')
        expect(page).to have_content('Click on a Group to access the provider object permissions for that group.')

        expect(page).to have_content('Provider Object Permissions were saved.')
        expect(page).to have_no_content('permissions were unable to be saved.')
      end
    end
  end
end
