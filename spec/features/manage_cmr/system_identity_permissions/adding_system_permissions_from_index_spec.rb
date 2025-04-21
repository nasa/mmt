describe 'Saving System Object Permissions from the system object permissions index page', js: true do
  before do
    @token = 'jwt_access_token'
    allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return('client_access_token')
    allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
    allow_any_instance_of(Pundit::UserContext).to receive(:token).and_return(@token)
    allow_any_instance_of(User).to receive(:urs_uid).and_return('dmistry')
  end
  before :all do
    VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
      @group_name = 'Test_System_Permissions_Group_1_from_index_page_testing_5'
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
    VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
      permissions_response_items = cmr_client.get_permissions(permissions_options, @token).body.fetch('items', [])

      permissions_response_items.each { |perm_item| remove_group_permissions(perm_item['concept_id']) }

      # delete the group
      delete_group(concept_id: @group_response['group_id'], admin: true)
    end
  end

  context 'when logging in as a system admin and visiting the system object permissions index page' do
    before do
      login_admin
      allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
      VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
        visit system_identity_permissions_path(@group_response['group_id'])
        # The group that is created for this test is on page on 11 of the table so we need to navigate to page 11
        # click_on 'Last'
        click_on '3'
        # click_on '4'

      end
    end

    it 'displays the index page and available groups to manage system permissions for' do
      expect(page).to have_content('System Object Permissions')
      expect(page).to have_content('Click on a System Group to access the system object permissions for that group.')

      within '.system-permissions-group-table' do
        expect(page).to have_content(@group_name)
      end
    end

    context 'when clicking on the system group' do
      before do
        VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
          click_on @group_name
        end
      end

      it 'displays the System Object Permissions page' do
        expect(page).to have_content("#{@group_name} System Object Permissions")
        expect(page).to have_content("Set permissions for the #{@group_name} group by checking the appropriate boxes below and clicking 'Submit'.")
      end

      context 'when clicking Cancel' do
        before do
          VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
            click_on 'Cancel'
          end
        end

        it 'returns to the system permissions index page' do
          expect(page).to have_content('System Object Permissions')
          expect(page).to have_content('Click on a System Group to access the system object permissions for that group.')

          within '.system-permissions-group-table' do
            expect(page).to have_content(@group_name)
          end
        end
      end

      context 'when selecting and saving system permissions' do
        before do
          VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
            @token = 'jwt_access_token'
            allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return('client_access_token')
            allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
            check('system_permissions_SYSTEM_OPTION_DEFINITION_', option: 'create')
            check('system_permissions_METRIC_DATA_POINT_SAMPLE_', option: 'read')
            check('system_permissions_EXTENDED_SERVICE_', option: 'delete')
            check('system_permissions_TAG_GROUP_', option: 'update')
            within '.system-permissions-form' do
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
