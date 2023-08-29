describe 'Changing or Removing System Identity Permissions', js: true do
  before do
    @token = 'jwt_access_token'
    allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return('client_access_token')
    allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)

    allow_any_instance_of(User).to receive(:urs_uid).and_return('dmistry')
  end
  before :all do
    VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
      @token = 'jwt_access_token'
      @group_name = 'Test_System_Permissions_Group_Testing_5'
      @group_response = create_group(
        name: @group_name,
        description: 'Group to test system permissions',
        provider_id: nil,
        admin: true
      )

      wait_for_cmr

      system_perm_1 = {
        'group_permissions' => [{
          'group_id'    => @group_response['group_id'],
          'permissions' => %w(update)
        }],
        'system_identity' => {
          'target' => 'SYSTEM_CALENDAR_EVENT'
        }
      }

      system_perm_2 = {
        'group_permissions' => [{
          'group_id'    => @group_response['group_id'],
          'permissions' => %w(create)
        }],
        'system_identity' => {
          'target' => 'SYSTEM_INITIALIZER'
        }
      }

      system_perm_3 = {
        'group_permissions' => [{
          'group_id'    => @group_response['group_id'],
          'permissions' => %w(create delete)
        }],
        'system_identity' => {
          'target' => 'SYSTEM_OPTION_DEFINITION'
        }
      }

      permissions = [system_perm_1, system_perm_2, system_perm_3]
      permissions.each { |perm| add_group_permissions(perm, @token) }

      wait_for_cmr
    end
  end

  after :all do
    permissions_options = {
      'page_size' => 50,
      'permitted_group' => @group_response['group_id']
    }
    VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
      permissions_response_items = cmr_client.get_permissions(permissions_options, @token).body.fetch('items', [])

      permissions_response_items.each { |perm_item| remove_group_permissions(perm_item['concept_id'], @token) }

      delete_group(concept_id: @group_response['group_id'], admin: true)
    end

    reindex_permitted_groups
  end

  context 'when visiting the system object permissions page for a system group from the system object permissions index page' do
    before do
      @token = 'jwt_access_token'
      login_admin
      allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)

      VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
        visit system_identity_permissions_path
        click_on @group_name
      end
    end

    it 'has the correct permissions checked' do
      expect(page).to have_checked_field('system_permissions_SYSTEM_CALENDAR_EVENT_', with: 'update')
      expect(page).to have_checked_field('system_permissions_SYSTEM_INITIALIZER_', with: 'create')
      expect(page).to have_checked_field('system_permissions_SYSTEM_OPTION_DEFINITION_', with: 'create')
      expect(page).to have_checked_field('system_permissions_SYSTEM_OPTION_DEFINITION_', with: 'delete')
    end

    context 'when changing and removing system permissions' do
      before do
        check('system_permissions_SYSTEM_CALENDAR_EVENT_', option: 'create')
        check('system_permissions_SYSTEM_CALENDAR_EVENT_', option: 'delete')

        uncheck('system_permissions_SYSTEM_INITIALIZER_', option: 'create')
        uncheck('system_permissions_SYSTEM_OPTION_DEFINITION_', option: 'delete')

        within '.system-permissions-form' do
          VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
            click_on 'Submit'
          end
        end

        wait_for_cmr
      end

      it 'displays a success message and no error message on the index page' do
        expect(page).to have_content('System Object Permissions')
        expect(page).to have_content('Click on a System Group to access the system object permissions for that group.')

        expect(page).to have_content('System Initializer, System Calendar Event, System Option Definition permissions were saved')
        expect(page).to have_no_content('permissions were unable to be saved')
      end
    end
  end
end
