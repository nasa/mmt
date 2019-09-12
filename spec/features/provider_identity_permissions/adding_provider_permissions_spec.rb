describe 'Saving Provider Identity Permissions', reset_provider: true do
  before :all do
    @provider_group = create_group(
      name: 'Test Group for Creating Provider Object Permissions',
      description: 'Group for creating provider object permissions',
      provider_id: 'MMT_2'
    )

    wait_for_cmr

    @system_group = create_group(
      name: 'Test System Group for Provider Permissions',
      description: 'System Group for creating provider permissions',
      provider_id: nil,
      admin: true
    )

    wait_for_cmr
  end

  after :all do
    # retrieve and delete the provider permissions for the system group
    # (they won't be removed by reset_provider)
    permissions_options = {
      'page_size' => 50,
      'permitted_group' => @system_group['concept_id']
    }

    permissions_response_items = cmr_client.get_permissions(permissions_options, 'access_token').body.fetch('items', [])

    permissions_response_items.each { |perm_item| cmr_client.delete_permission(perm_item['concept_id'], 'access_token') }

    # delete the system group
    delete_group(concept_id: @system_group['concept_id'], admin: true)
  end

  context 'when adding provider permissions for a provider group' do
    before do
      login

      visit edit_provider_identity_permission_path(@provider_group['concept_id'])

      check('provider_permissions_GROUP_', option: 'read')
      check('provider_permissions_INGEST_MANAGEMENT_ACL_', option: 'update')
      check('provider_permissions_OPTION_DEFINITION_', option: 'create')
      check('provider_permissions_PROVIDER_POLICIES_', option: 'delete')

      within '.provider-permissions-form' do
        click_on 'Submit'
      end

      wait_for_cmr
    end

    it 'displays a success message and no error message on the index page' do
      expect(page).to have_content('Provider Object Permissions')
      expect(page).to have_content('Click on a Group to access the provider object permissions for that group.')

      expect(page).to have_content('Option Definition, Provider Policies, Group, Ingest Management Acl permissions were saved')
      expect(page).to have_no_content('permissions were unable to be saved')
    end
  end

  context 'when adding provider permissions for a system group' do
    before do
      login_admin

      visit edit_provider_identity_permission_path(@system_group['concept_id'])

      check('provider_permissions_PROVIDER_CALENDAR_EVENT_', option: 'create')
      check('provider_permissions_INGEST_MANAGEMENT_ACL_', option: 'read')
      check('provider_permissions_PROVIDER_INFORMATION_', option: 'update')
      check('provider_permissions_EXTENDED_SERVICE_', option: 'delete')

      within '.provider-permissions-form' do
        click_on 'Submit'
      end

      wait_for_cmr
    end

    it 'displays a success message and no error message on the index page' do
      expect(page).to have_content('Provider Object Permissions')
      expect(page).to have_content('Click on a Group to access the provider object permissions for that group.')

      expect(page).to have_content('Extended Service, Provider Calendar Event, Provider Information, Ingest Management Acl permissions were saved')
      expect(page).to have_no_content('permissions were unable to be saved')
    end
  end
end
