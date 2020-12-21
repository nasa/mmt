describe 'Saving Provider Object Permissions from the group show page', reset_provider: true do
  before :all do
    @provider_group_name = 'Test Group for Creating Provider Object Permissions from group page'
    @provider_group_description = 'Group for creating provider object permissions'
    @provider_group = create_group(
      name: @provider_group_name,
      description: @provider_group_description,
      provider_id: 'MMT_2'
    )

    wait_for_cmr

    @system_group_name = 'Test System Group for Provider Permissions from group page'
    @system_group_description = 'System Group for creating provider permissions'
    @system_group = create_group(
      name: @system_group_name,
      description: @system_group_description,
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

    permissions_response_items.each { |perm_item| remove_group_permissions(perm_item['concept_id']) }

    # delete the system group
    delete_group(concept_id: @system_group['concept_id'], admin: true)
  end

  context 'when logging in as a provider admin' do
    before do
      login
    end

    context 'when visiting the provider group page' do
      before do
        visit group_path(@provider_group['concept_id'])
      end

      it 'displays the group show page' do
        expect(page).to have_content(@provider_group_name)
        expect(page).to have_content(@provider_group_description)
        expect(page).to have_content('Associated Collection Permissions')
        expect(page).to have_content('Members')
      end

      it 'displays the link to manage Provider Object Permissions' do
        expect(page).to have_content('Manage Provider Object Permissions')
        expect(page).to have_link('Provider Object Permissions for MMT_2')
      end

      context 'when clicking on the provider object permissions link' do
        before do
          click_on 'Provider Object Permissions for MMT_2'
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

          it 'returns to the group page' do
            expect(page).to have_content(@provider_group_name)
            expect(page).to have_content(@provider_group_description)
            expect(page).to have_content('Associated Collection Permissions')
            expect(page).to have_content('Members')

            expect(page).to have_content('Manage Provider Object Permissions')
            expect(page).to have_link('Provider Object Permissions for MMT_2')
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

          it 'displays a success message and no error message on the group page' do
            expect(page).to have_content('Option Definition, Provider Policies, Group, Ingest Management Acl permissions were saved')
            expect(page).to have_no_content('permissions were unable to be saved')

            expect(page).to have_content(@provider_group_name)
            expect(page).to have_content(@provider_group_description)
            expect(page).to have_content('Associated Collection Permissions')
            expect(page).to have_content('Members')

            expect(page).to have_content('Manage Provider Object Permissions')
            expect(page).to have_link('Provider Object Permissions for MMT_2')
          end
        end
      end
    end
  end

  context 'when logging in as a system admin' do
    before do
      login_admin
    end

    context 'when visiting the provider group page' do
      before do
        visit group_path(@provider_group['concept_id'])
      end

      it 'displays the group show page' do
        expect(page).to have_content(@provider_group_name)
        expect(page).to have_content(@provider_group_description)
        expect(page).to have_content('Associated Collection Permissions')
        expect(page).to have_content('Members')
      end

      it 'displays the link to manage Provider Object Permissions' do
        expect(page).to have_content('Manage Provider Object Permissions')
        expect(page).to have_link('Provider Object Permissions for MMT_2')
      end

      it 'does not display the link to manage System Object Permissions' do
        expect(page).to have_no_content('Manage Provider and System Object Permissions')
        expect(page).to have_no_link('System Object Permissions')
      end
    end

    context 'when visiting the system group page' do
      before do
        visit group_path(@system_group['concept_id'])
      end

      it 'displays the system group show page' do
        expect(page).to have_content(@system_group_name)
        expect(page).to have_content(@system_group_description)
        expect(page).to have_content('Associated Collection Permissions')
        expect(page).to have_content('Members')
      end

      it 'displays the link to manage Provider and System Object Permissions' do
        expect(page).to have_content('Manage Provider and System Object Permissions')
        expect(page).to have_link('System Object Permissions')
        expect(page).to have_link('Provider Object Permissions for MMT_2')
      end

      context 'when clicking on the provider object permissions link' do
        before do
          click_on 'Provider Object Permissions for MMT_2'
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

          it 'returns to the group page' do
            expect(page).to have_content(@system_group_name)
            expect(page).to have_content(@system_group_description)
            expect(page).to have_content('Associated Collection Permissions')
            expect(page).to have_content('Members')

            expect(page).to have_content('Manage Provider and System Object Permissions')
            expect(page).to have_link('System Object Permissions')
            expect(page).to have_link('Provider Object Permissions for MMT_2')
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

          it 'displays a success message and no error message on the system group page' do
            expect(page).to have_content('Extended Service, Provider Calendar Event, Provider Information, Ingest Management Acl permissions were saved')
            expect(page).to have_no_content('permissions were unable to be saved')

            expect(page).to have_content(@system_group_name)
            expect(page).to have_content(@system_group_description)

            expect(page).to have_content('SYS')
            expect(page).to have_css('span.eui-badge--sm')

            expect(page).to have_content('Associated Collection Permissions')
            expect(page).to have_content('Members')

            expect(page).to have_content('Manage Provider and System Object Permissions')
            expect(page).to have_link('System Object Permissions')
            expect(page).to have_link('Provider Object Permissions for MMT_2')
          end
        end
      end
    end
  end
end
