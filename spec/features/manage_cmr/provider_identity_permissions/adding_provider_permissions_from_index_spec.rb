# EDL Failed Test
describe 'Saving Provider Object Permissions from the provider object permissions index page', reset_provider: true, skip:true do
  before :all do
    VCR.use_cassette('edl', record: :new_episodes) do
      @provider_group_name = 'Test_Group_for_Creating_Provider_Object_Permissions_from_index_page'
      @provider_group = create_group(
        name: @provider_group_name,
        description: 'Group for creating provider object permissions',
        provider_id: 'MMT_2'
      )

      wait_for_cmr

      @system_group_name = 'Test_System_Group_for_Provider_Permissions_from_index_page'
      @system_group = create_group(
        name: @system_group_name,
        description: 'System Group for creating provider permissions',
        provider_id: nil,
        admin: true
      )

      wait_for_cmr
    end
  end

  after :all do
    # retrieve and delete the provider permissions for the system group
    # (they won't be removed by reset_provider)
    permissions_options = {
      'page_size' => 50,
      'permitted_group' => @system_group['group_id']
    }

    permissions_response_items = cmr_client.get_permissions(permissions_options, 'access_token').body.fetch('items', [])

    permissions_response_items.each { |perm_item| remove_group_permissions(perm_item['concept_id']) }

    VCR.use_cassette('edl', record: :new_episodes) do
      # delete the system group
      delete_group(concept_id: @system_group['group_id'], admin: true)
    end

    reindex_permitted_groups
  end

  context 'when logging in as a provider admin' do
    before do
      login
    end

    context 'when visiting the provider object permissions index page' do
      before do
        VCR.use_cassette('edl', record: :new_episodes) do
          visit provider_identity_permissions_path
        end
      end

      it 'displays the available groups to manage provider permissions for' do
        expect(page).to have_content('Provider Object Permissions')
        expect(page).to have_content('Click on a Group to access the provider object permissions for that group.')

        within '.provider-permissions-group-table' do
          expect(page).to have_content('MMT_2 Admin Group')
          expect(page).to have_content(@provider_group_name)
        end
      end

      context 'when clicking on the provider group' do
        before do
          click_on @provider_group_name
        end

        it 'displays the Provider Object Permissions page' do
          expect(page).to have_content("#{@provider_group_name} Provider Object Permissions for MMT_2")
          expect(page).to have_content("Set permissions for the #{@provider_group_name} group by checking the appropriate boxes below and clicking 'Submit'.")

          expect(page).to have_css('.provider-permissions-table')
        end

        context 'when clicking cancel' do
          before do
            click_on 'Cancel'
          end

          it 'returns to the provider permissions index page' do
            expect(page).to have_content('Provider Object Permissions')
            expect(page).to have_content('Click on a Group to access the provider object permissions for that group.')

            within '.provider-permissions-group-table' do
              expect(page).to have_content('MMT_2 Admin Group')
              expect(page).to have_content(@provider_group_name)
            end
          end
        end

        context 'when adding provider permissions for a provider group' do
          before do
            check('provider_permissions_GROUP_', option: 'read')
            check('provider_permissions_INGEST_MANAGEMENT_ACL_', option: 'update')
            check('provider_permissions_OPTION_DEFINITION_', option: 'create')
            check('provider_permissions_PROVIDER_POLICIES_', option: 'delete')

            within '.provider-permissions-form' do
              click_on 'Submit'
            end

            wait_for_cmr
          end

          it 'displays a success message and no error message on the provider object permissions index page' do
            expect(page).to have_content('Provider Object Permissions')
            expect(page).to have_content('Click on a Group to access the provider object permissions for that group.')

            expect(page).to have_content('Option Definition, Provider Policies, Group, Ingest Management Acl permissions were saved')
            expect(page).to have_no_content('permissions were unable to be saved')

            within '.provider-permissions-group-table' do
              expect(page).to have_content('MMT_2 Admin Group')
              expect(page).to have_content(@provider_group_name)
            end
          end
        end
      end
    end
  end

  context 'when logging in as a system admin' do
    before do
      login_admin
    end

    context 'when visiting the provider object permissions index page' do
      before do
        VCR.use_cassette('edl', record: :new_episodes) do
          visit provider_identity_permissions_path
        end
      end

      it 'displays the available groups to manage provider permissions for' do
        expect(page).to have_content('Provider Object Permissions')
        expect(page).to have_content('Click on a Group to access the provider object permissions for that group.')

        within '.provider-permissions-group-table' do
          expect(page).to have_content('MMT_2 Admin Group')
          expect(page).to have_content(@provider_group_name)
          expect(page).to have_content('Administrators')
          expect(page).to have_content('Administrators_2')
          expect(page).to have_content(@system_group_name)
        end
      end

      context 'when clicking on the system group' do
        before do
          click_on @system_group_name
        end

        it 'displays the Provider Object Permissions page' do
          expect(page).to have_content("#{@system_group_name} Provider Object Permissions for MMT_2")
          expect(page).to have_content("Set permissions for the #{@system_group_name} group by checking the appropriate boxes below and clicking 'Submit'.")

          expect(page).to have_css('.provider-permissions-table')
        end

        context 'when clicking cancel' do
          before do
            click_on 'Cancel'
          end

          it 'returns to the provider permissions index page' do
            expect(page).to have_content('Provider Object Permissions')
            expect(page).to have_content('Click on a Group to access the provider object permissions for that group.')

            within '.provider-permissions-group-table' do
              expect(page).to have_content('MMT_2 Admin Group')
              expect(page).to have_content(@provider_group_name)
            end
          end
        end

        context 'when adding provider permissions for a system group' do
          before do
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

            within '.provider-permissions-group-table' do
              expect(page).to have_content('MMT_2 Admin Group')
              expect(page).to have_content(@provider_group_name)
              expect(page).to have_content('Administrators')
              expect(page).to have_content('Administrators_2')
              expect(page).to have_content(@system_group_name)
            end
          end
        end
      end
    end
  end
end
