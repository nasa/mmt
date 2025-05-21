describe 'Saving System Object Permissions from the system group show page', js: true do
  before do
    @token = 'jwt_access_token'
    allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return('client_access_token')
    allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
    allow_any_instance_of(Pundit::UserContext).to receive(:token).and_return(@token)
    allow_any_instance_of(User).to receive(:urs_uid).and_return('dmistry')

    VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
      @group_name = 'Test_System_Permissions_Group_1_from_group_page_15'
      @group_description = 'Group to test system permissions'
      @group_response = create_group(
        name: @group_name,
        description: @group_description,
        provider_id: nil,
        admin: true
      )
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
      permissions_response_items.each { |perm_item| remove_group_permissions(perm_item['concept_id']) }

      delete_group(concept_id: @group_response['group_id'], admin: true)
    end
  end

  context 'when logging in as a system admin and visiting the system group show page' do
    before do
      login_admin
      allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
      VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
        visit group_path(@group_response['group_id'])
      end
    end

    it 'displays the system group show page' do
      expect(page).to have_content(@group_name)
      expect(page).to have_content(@group_description)

      expect(page).to have_content('SYS')
      expect(page).to have_css('span.eui-badge--sm')

      expect(page).to have_content('Associated Collection Permissions')
      expect(page).to have_content('Members')
    end

    it 'displays the links to manage Provider and System Object Permissions' do
      expect(page).to have_content('Manage Provider and System Object Permissions')
      expect(page).to have_link('System Object Permissions')
      expect(page).to have_link('Provider Object Permissions for MMT_2')
    end

    context 'when clicking on the link to manage system permissions' do
      before do
        VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
          click_on 'System Object Permissions'
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

        it 'returns to the system group page' do
          expect(page).to have_content(@group_name)
          expect(page).to have_content(@group_description)

          expect(page).to have_content('SYS')
          expect(page).to have_css('span.eui-badge--sm')

          expect(page).to have_content('Associated Collection Permissions')
          expect(page).to have_content('Members')

          expect(page).to have_content('Manage Provider and System Object Permissions')
          expect(page).to have_link('System Object Permissions')
          expect(page).to have_link('Provider Object Permissions for MMT_2')
        end
      end

      context 'when selecting and saving system permissions' do
        before do
          VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
            check('system_permissions_SYSTEM_OPTION_DEFINITION_', option: 'create')
            check('system_permissions_METRIC_DATA_POINT_SAMPLE_', option: 'read')
            check('system_permissions_EXTENDED_SERVICE_', option: 'delete')
            check('system_permissions_TAG_GROUP_', option: 'update')

            within '.system-permissions-form' do
              allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)

              click_on 'Submit'
            end
          end

          wait_for_cmr
        end

        it 'displays a success message and no error message on the system group page' do
          expect(page).to have_content('Extended Service, Metric Data Point Sample, System Option Definition, Tag Group permissions were saved.')
          expect(page).to have_no_content('permissions were unable to be saved')

          expect(page).to have_content(@group_name)
          expect(page).to have_content(@group_description)

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
