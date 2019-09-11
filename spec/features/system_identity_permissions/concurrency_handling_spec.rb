describe 'Concurrent Users Editing System Permissions', js: true do
  before do
    @group_response = create_group(name: 'Test System Permissions Group 1', description: 'Group to test system permissions', provider_id: nil, admin: true)
    @group_response2 = create_group(name: 'Test System Permissions Group 2', description: 'Group to test system permissions', provider_id: nil, admin: true)
  end

  after do
    # delete system permissions for the group
    permissions_options = {
      'page_size' => 30,
      'permitted_group' => @group_response['concept_id']
    }

    permissions_options2 = {
      'page_size' => 30,
      'permitted_group' => @group_response2['concept_id']
    }

    permissions_response_items = cmr_client.get_permissions(permissions_options, 'access_token_admin').body.fetch('items', [])
    permissions_response_items.each { |perm_item| cmr_client.delete_permission(perm_item['concept_id'], 'access_token_admin') }

    permissions_response_items2 = cmr_client.get_permissions(permissions_options2, 'access_token_admin').body.fetch('items', [])
    permissions_response_items2.each { |perm_item| cmr_client.delete_permission(perm_item['concept_id'], 'access_token_admin') }

    # delete the group
    delete_group(concept_id: @group_response['concept_id'], admin: true)
    delete_group(concept_id: @group_response2['concept_id'], admin: true)
  end

  # These tests generally follow the format of:
  # OPTIONAL: Set some permissions
  # Visit the page for a group
  # Use the cmr_client to manipulate a permission
  # OPTIONAL: interact with the form
  # Submit the form
  # Check for rejections.

  context 'when incorrectly deleting' do
    before do
      login_admin
      visit edit_system_identity_permission_path(@group_response['concept_id'])
      # By adding permissions after the 'user' loads the page, the system would
      # have a revision id in the update function that does not match the empty
      # revision id it got from the view/edit
      # If not prevented, this would manifest as deleting the other user's changes
      cmr_client.add_group_permissions(
        { 'group_permissions' =>
          [{
            'group_id' => @group_response['concept_id'],
            'permissions' => ['create']
          }],
          'system_identity' =>
          {
            'target' => 'DASHBOARD_ADMIN'
          } }, 'access_token_admin'
      )
      click_on 'Submit'
    end

    it 'does not succeed' do
      expect(page).to have_content("'Dashboard Admin' permissions were unable to be saved because another user made changes to those permissions.")
    end
  end

  context 'when incorrectly creating' do
    before do
      login_admin
      # When loading the page, the user has the permission to create in DASHBOARD_ADMIN
      # But another user deletes that permission before this one submits the page.
      # If not prevented, this would manifest as creating over the other user's delete
      response = cmr_client.add_group_permissions(
        { 'group_permissions' =>
          [{
            'group_id' => @group_response['concept_id'],
            'permissions' => ['create']
          }],
          'system_identity' =>
          {
            'target' => 'DASHBOARD_ADMIN'
          } }, 'access_token_admin'
      )
      visit edit_system_identity_permission_path(@group_response['concept_id'])
      cmr_client.delete_permission(response.body['concept_id'], 'access_token_admin')
      click_on 'Submit'
    end

    it 'does not succeed' do
      expect(page).to have_content("'Dashboard Admin' permissions were unable to be saved because another user made changes to those permissions.")
    end
  end

  context 'when updating with the wrong revision_id' do
    before do
      login_admin
      # When loading hte page, the user has the permission to read in USER.
      # But another user updates the permissions while this one is still deciding
      # on changes.  When this user submits the document as it was loaded,
      # the user would be overwriting the intervening user's added permissions.
      response = cmr_client.add_group_permissions(
        { 'group_permissions' =>
          [{
            'group_id' => @group_response['concept_id'],
            'permissions' => ['read']
          }],
          'system_identity' =>
          {
            'target' => 'USER'
          } }, 'access_token_admin'
      )
      visit edit_system_identity_permission_path(@group_response['concept_id'])
      cmr_client.update_permission(
        { 'group_permissions' =>
          [{
            'group_id' => @group_response['concept_id'],
            'permissions' => %w[read update]
          }],
          'system_identity' =>
          {
            'target' => 'USER'
          } }, response.body['concept_id'], 'access_token_admin'
      )
      check('system_permissions_USER_', option: 'read')

      click_on 'Submit'
    end

    it 'does not succeed' do
      expect(page).to have_content("'User' permissions were unable to be saved because another user made changes to those permissions.")
    end
  end
end
