# EDL Failed Test
describe 'Saving System Object Permissions from the system object permissions index page', skip:true do
  before :all do
    VCR.use_cassette('edl', record: :new_episodes) do
      @group_name = 'Test_System_Permissions_Group_1_from_index_page'
      @group_response = create_group(
        name: @group_name,
        description: 'Group to test system permissions',
        provider_id: nil,
        admin: true)
      end
  end

  after :all do
    # delete system permissions for the group
    permissions_options = {
      'page_size' => 30,
      'permitted_group' => @group_response['group_id']
    }

    permissions_response_items = cmr_client.get_permissions(permissions_options, 'access_token_admin').body.fetch('items', [])

    permissions_response_items.each { |perm_item| remove_group_permissions(perm_item['concept_id']) }

    # delete the group
    VCR.use_cassette('edl', record: :new_episodes) do
      delete_group(concept_id: @group_response['group_id'], admin: true)
    end
  end

  context 'when logging in as a system admin and visiting the system object permissions index page' do
    before do
      login_admin

      VCR.use_cassette('edl', record: :new_episodes) do
        visit system_identity_permissions_path(@group_response['group_id'])
      end
    end

    it 'displays the index page and available groups to manage system permissions for' do
      expect(page).to have_content('System Object Permissions')
      expect(page).to have_content('Click on a System Group to access the system object permissions for that group.')

      within '.system-permissions-group-table' do
        expect(page).to have_content('Administrators')
        expect(page).to have_content('Administrators_2')
        expect(page).to have_content(@group_name)
      end
    end

    context 'when clicking on the system group' do
      before do
        click_on @group_name
      end

      it 'displays the System Object Permissions page' do
        expect(page).to have_content("#{@group_name} System Object Permissions")
        expect(page).to have_content("Set permissions for the #{@group_name} group by checking the appropriate boxes below and clicking 'Submit'.")
      end

      context 'when clicking Cancel' do
        before do
          VCR.use_cassette('edl', record: :new_episodes) do
            click_on 'Cancel'
          end
        end

        it 'returns to the system permissions index page' do
          expect(page).to have_content('System Object Permissions')
          expect(page).to have_content('Click on a System Group to access the system object permissions for that group.')

          within '.system-permissions-group-table' do
            expect(page).to have_content('Administrators')
            expect(page).to have_content('Administrators_2')
            expect(page).to have_content(@group_name)
          end
        end
      end

      context 'when selecting and saving system permissions' do
        before do
          check('system_permissions_SYSTEM_OPTION_DEFINITION_', option: 'create')
          check('system_permissions_METRIC_DATA_POINT_SAMPLE_', option: 'read')
          check('system_permissions_EXTENDED_SERVICE_', option: 'delete')
          check('system_permissions_TAG_GROUP_', option: 'update')

          within '.system-permissions-form' do
            VCR.use_cassette('edl', record: :new_episodes) do
              click_on 'Submit'
            end
          end

          wait_for_cmr
        end

        it 'displays a success message and no error message on the index page' do
          expect(page).to have_content('System Object Permissions')
          expect(page).to have_content('Click on a System Group to access the system object permissions for that group.')

          expect(page).to have_content('Extended Service, Metric Data Point Sample, System Option Definition, Tag Group permissions were saved.')
          expect(page).to have_no_content('permissions were unable to be saved')
        end
      end
    end
  end
end
