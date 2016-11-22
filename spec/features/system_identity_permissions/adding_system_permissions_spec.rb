# MMT-586

require 'rails_helper'

describe 'Saving System Identity Permissions' do
  before :all do
    # instantiate cmr client
    cmr_client = Cmr::Client.client_for_environment(Rails.configuration.cmr_env, Rails.configuration.services)

    system_group_params = { 'name' => 'Test System Permissions Group 1',
                            'description': 'Group to test system permissions' }
    @group_response = cmr_client.create_group(system_group_params, 'access_token_admin').body

    wait_for_cmr
  end

  before do
    login_admin

    visit edit_system_identity_permission_path(@group_response['concept_id'])
  end

  after :all do
    # instantiate cmr client
    cmr_client = Cmr::Client.client_for_environment(Rails.configuration.cmr_env, Rails.configuration.services)

    # delete system permissions for the group
    permissions_options = { 'page_size' => 30,
                            'permitted_group' => @group_response['concept_id'] }
    permissions_response_items = cmr_client.get_permissions(permissions_options, 'access_token_admin').body.fetch('items', [])

    permissions_response_items.each { |perm_item| cmr_client.delete_permission(perm_resp['concept_id'], 'access_token_admin') }

    # delete the group
    cmr_client.delete_group(@group_response['concept_id'], 'access_token_admin')

    wait_for_cmr
  end

  context 'when selecting and saving system permissions' do
    before do
      # choose some permissions to choose
      check('system_permissions_SYSTEM_OPTION_DEFINITION_', option: 'create')
      check('system_permissions_METRIC_DATA_POINT_SAMPLE_', option: 'read')
      check('system_permissions_EXTENDED_SERVICE_', option: 'delete')
      check('system_permissions_TAG_GROUP_', option: 'update')

      click_on 'Save'

      wait_for_cmr
    end

    it 'displays a success message and no error message on the index page' do
      expect(page).to have_content('System Object Permissions')
      expect(page).to have_content('Click on a System Group to access the system object permissions for that group.')

      expect(page).to have_content('System Object Permissions were saved.')
      expect(page).to have_no_content('permissions were unable to be saved.')
    end
  end
end
