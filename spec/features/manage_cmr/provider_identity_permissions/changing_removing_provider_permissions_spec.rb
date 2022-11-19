describe 'Changing or Removing Provider Identity Permissions', reset_provider: true do
  before do
    @token = 'jwt_access_token'
    allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return('client_access_token')
    allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
    allow_any_instance_of(ApplicationController).to receive(:echo_provider_token).and_return(@token)
    allow_any_instance_of(User).to receive(:urs_uid).and_return('dmistry')
  end

  before :all do
    @token = 'jwt_access_token'
    VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
      @group_name = 'Test_Group_for_Updating_Provider_Object_Permissions_test_40'
      @group = create_group(
        name: @group_name,
        description: 'Group for updating provider object permissions'
      )

      wait_for_cmr

      provider_perm_1 = {
        'group_permissions' => [{
          'group_id' => @group['group_id'],
          'permissions' => ['read']
        }],
        'provider_identity' => {
          'target' => 'OPTION_ASSIGNMENT',
          'provider_id' => 'MMT_2'
        }
      }

      provider_perm_2 = {
        'group_permissions' => [{
          'group_id' => @group['group_id'],
          'permissions' => ['update']
        }],
        'provider_identity' => {
          'target' => 'PROVIDER_ORDER_TRACKING_ID',
          'provider_id' => 'MMT_2'
        }
      }

      provider_perm_3 = {
        'group_permissions' => [{
          'group_id' => @group['group_id'],
          'permissions' => ['create', 'delete']
        }],
        'provider_identity' => {
          'target' => 'AUTHENTICATOR_DEFINITION',
          'provider_id' => 'MMT_2'
        }
      }

      permissions = [provider_perm_1,provider_perm_2,provider_perm_3]
      permissions.each { |perm| add_group_permissions(perm, @token) }

      wait_for_cmr
    end
  end

  context 'when visiting the provider object permissions page for the group from the provider object permissions index page' do
    before do
      @token = 'jwt_access_token'
      login
      allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)

      VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
        visit provider_identity_permissions_path
        click_on 'Last'
        click_on @group_name
      end
    end

    it 'has the correct permissions checked' do
      expect(page).to have_checked_field('provider_permissions_OPTION_ASSIGNMENT_', with: 'read')
      expect(page).to have_checked_field('provider_permissions_PROVIDER_ORDER_TRACKING_ID_', with: 'update')
      expect(page).to have_checked_field('provider_permissions_AUTHENTICATOR_DEFINITION_', with: 'create')
      expect(page).to have_checked_field('provider_permissions_AUTHENTICATOR_DEFINITION_', with: 'delete')
    end

    context 'when changing and removing provider permissions' do
      before do
        VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
          uncheck('provider_permissions_AUTHENTICATOR_DEFINITION_', option: 'delete')
          uncheck('provider_permissions_PROVIDER_ORDER_TRACKING_ID_', option: 'update')
          uncheck('provider_permissions_OPTION_ASSIGNMENT_', option: 'read')

          check('provider_permissions_OPTION_ASSIGNMENT_', option: 'delete')
          check('provider_permissions_INGEST_MANAGEMENT_ACL_', option: 'read')
          check('provider_permissions_OPTION_DEFINITION_', option: 'create')
          check('provider_permissions_PROVIDER_POLICIES_', option: 'update')
          within '.provider-permissions-form' do
            click_on 'Submit'
          end
        end

        wait_for_cmr
      end

      it 'displays a success message and no error message on the index page' do
        expect(page).to have_content('Provider Object Permissions')
        expect(page).to have_content('Click on a Group to access the provider object permissions for that group.')

        expect(page).to have_content('Provider Order Tracking Id, Authenticator Definition, Ingest Management Acl, Option Assignment, Option Definition, Provider Policies permissions were saved')
        expect(page).to have_no_content('permissions were unable to be saved')
      end
    end
  end
end
