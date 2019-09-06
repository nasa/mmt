describe 'Concurrent Users Editing Provider Permissions', reset_provider: true do
  before :all do
    @provider_group = create_group(
      name: 'Test Group for Creating Provider Object Permissions',
      description: 'Group for creating provider object permissions',
      provider_id: 'MMT_2'
    )
    @provider_group2 = create_group(
      name: 'Test Group 2 for Creating Provider Object Permissions',
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

  context 'when incorrectly removing a group' do
    before do
      login

      @response = cmr_client.add_group_permissions(
        { 'group_permissions' =>
          [{
            'group_id' => @provider_group2['concept_id'],
            'permissions' => ['read']
          }, {
            'group_id' => @provider_group['concept_id'],
            'permissions' => ['read']
          }],
          'provider_identity' =>
          {
            'target' => 'USER',
            'provider_id' => 'MMT_2'
          } }, 'access_token_admin'
      )
      wait_for_cmr
      visit edit_provider_identity_permission_path(@provider_group['concept_id'])
      cmr_client.update_permission(
        { 'group_permissions' =>
          [{
            'group_id' => @provider_group2['concept_id'],
            'permissions' => ['read']
          }],
          'provider_identity' =>
          {
            'target' => 'USER',
            'provider_id' => 'MMT_2'
          } }, @response.body['concept_id'], 'access_token_admin'
      )

      uncheck('provider_permissions_USER_', option: 'read')

      click_on 'Submit'
    end

    it 'does not succeed' do
      expect(page).to have_content("'User' permissions were unable to be saved because another user made changes to those permissions.")
    end

    after do
      cmr_client.delete_permission(@response.body['concept_id'], 'access_token')
    end
  end
end
