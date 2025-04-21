describe 'Concurrent Users Editing System Permissions', js: true do
  before do
    VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
    @token = 'jwt_access_token'
    allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return('client_access_token')
    allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
    allow_any_instance_of(Pundit::UserContext).to receive(:token).and_return(@token)
    allow_any_instance_of(User).to receive(:urs_uid).and_return('dmistry')

    @group_name = 'Test_System_Permissions_Group_50'
    @group_response = create_group(
      name: @group_name,
      description: 'Group to test system permissions',
      provider_id: nil,
      admin: true)
    end
  end

  after do
    # delete system permissions for the group
    permissions_options = {
      'page_size' => 30,
      'permitted_group' => @group_response['group_id']
    }
    # delete the group
    VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do

      permissions_response_items = cmr_client.get_permissions(permissions_options, @token).body.fetch('items', [])
      permissions_response_items.each { |perm_item| remove_group_permissions(perm_item['concept_id'],@token) }

      delete_group(concept_id: @group_response['group_id'], admin: true)
    end
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
      VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
        @token = 'jwt_access_token'
        allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return('client_access_token')
        allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
        allow_any_instance_of(Pundit::UserContext).to receive(:token).and_return(@token)
        allow_any_instance_of(User).to receive(:urs_uid).and_return('hvtranho')
        visit edit_system_identity_permission_path(@group_response['group_id'])
        # By adding permissions after the 'user' loads the page, the system would
        # have a revision id in the update function that does not match the empty
        # revision id it got from the view/edit
        # If not prevented, this would manifest as deleting the other user's changes
        add_group_permissions(
          { 'group_permissions' =>
            [{
              'group_id' => @group_response['group_id'],
              'permissions' => ['create']
            }],
            'system_identity' =>
            {
              'target' => 'DASHBOARD_ADMIN'
            } }, @token
        )
        click_on 'Submit'
      end
    end

    it 'does not succeed' do
      expect(page).to have_content('Dashboard Admin permissions were unable to be saved because another user made changes to those permissions.')
    end
  end

  context 'when deleting with the wrong revision_id' do
    before do
      login_admin

      VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_2_vcr", record: :none) do
        @token = 'jwt_access_token'
        allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return('client_access_token')
        allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
        allow_any_instance_of(Pundit::UserContext).to receive(:token).and_return(@token)
        allow_any_instance_of(User).to receive(:urs_uid).and_return('chris.gokey')
        add_group_permissions(
          { 'group_permissions' =>
            [{
              'group_id' => @group_response['group_id'],
              'permissions' => ['create']
            }],
            'system_identity' =>
            {
              'target' => 'TAG_GROUP'
            } }, @token
        )

        visit system_identity_permissions_path
        click_on '2'

        click_on @group_name
      end

      uncheck('system_permissions_TAG_GROUP_', option: 'create')

      # Difficult to actually generate the race condition in CMR, just VCR it.
      # VCR's configuration needs to be adjusted to hit localhost to make the
      # recording.
      VCR.configure do |c|
        c.ignore_localhost = false
      end

      # Need a dynamic cassette in order to match the correct group concept ID.
      # If the wrong group concept ID is returned as part of the interaction
      # series, the sorter determines that this should be a remove group
      # rather than a delete. Causing the next call to be a put instead of a
      # delete.  This means that the VCR does not recognize the request properly
      # and generates an error. Changing the verb means that the delete code
      # in the controller/helper are not getting tested, so this is the best
      # solution.
      # This request should be a valid request to delete in CMR, but the VCR is
      # configured to return the response from an invalid request in order
      # to test our response to it.
      VCR.use_cassette('permissions/concurrent_delete', erb: { group_id: @group_response['concept_id'] }, record: :none) do
        allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return('client_access_token')
        allow_any_instance_of(ApplicationController).to receive(:token).and_return('jwt_access_token')
        allow_any_instance_of(Pundit::UserContext).to receive(:token).and_return(@token)
        allow_any_instance_of(User).to receive(:urs_uid).and_return('chris.gokey')
        click_on 'Submit'
      end

      VCR.configure do |c|
        c.ignore_localhost = true
      end
    end

    it 'does not succeed' do
      expect(page).to have_content('Dashboard Admin, Tag Group, User permissions were unable to be saved because another user made changes to those permissions.')
    end
  end

  context 'when incorrectly creating' do
    before do
      login_admin
      # When loading the page, the user has the permission to create in DASHBOARD_ADMIN
      # But another user deletes that permission before this one submits the page.
      # If not prevented, this would manifest as creating over the other user's delete
      VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
        @token = 'jwt_access_token'
        allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return('client_access_token')
        allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
        allow_any_instance_of(Pundit::UserContext).to receive(:token).and_return(@token)
        response = add_group_permissions(
          { 'group_permissions' =>
            [{
              'group_id' => @group_response['group_id'],
              'permissions' => ['create']
            }],
            'system_identity' =>
            {
              'target' => 'DASHBOARD_ADMIN'
            } }, @token
        )
        visit edit_system_identity_permission_path(@group_response['group_id'])
        remove_group_permissions(response['concept_id'], @token)
        click_on 'Submit'
      end
    end

    it 'does not succeed' do
      expect(page).to have_content('Dashboard Admin permissions were unable to be saved because another user made changes to those permissions.')
    end
  end

  context 'when updating with the wrong revision_id' do
    before do
      login_admin
      # When loading the page, the user has the permission to read in USER.
      # But another user updates the permissions while this one is still deciding
      # on changes.  When this user submits the document as it was loaded,
      # the user would be overwriting the intervening user's added permissions.
      VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_3_vcr", record: :none) do

        @token = 'jwt_access_token'
        allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return('client_access_token')
        allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
        allow_any_instance_of(Pundit::UserContext).to receive(:token).and_return(@token)
        allow_any_instance_of(User).to receive(:urs_uid).and_return('chris.gokey')
        response = add_group_permissions(
          { 'group_permissions' =>
            [{
              'group_id' => @group_response['group_id'],
              'permissions' => ['read']
            }],
            'system_identity' =>
            {
              'target' => 'USER'
            } }, @token
        )
        visit edit_system_identity_permission_path(@group_response['group_id'])
        cmr_client.update_permission(
          { 'group_permissions' =>
            [{
              'group_id' => @group_response['group_id'],
              'permissions' => %w[read update]
            }],
            'system_identity' =>
            {
              'target' => 'USER'
            } }, response['concept_id'], @token
        )
        check('system_permissions_USER_', option: 'read')

        click_on 'Submit'
      end
    end

    it 'does not succeed' do
      expect(page).to have_content('User permissions were unable to be saved because another user made changes to those permissions.')
    end
  end
end
