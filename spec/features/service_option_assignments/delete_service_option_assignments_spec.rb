require 'rails_helper'

describe 'Deleting a Service Option Assignment', reset_provider: true, js: true do
  before :all do
    # create a group
    @service_option_assignment_group = create_group(name: 'Service Option Association Group for Permissions [DELETE]', members: ['testuser'])

    # give the group permission to delete
    @delete_permissions = add_permissions_to_group(@service_option_assignment_group['concept_id'], 'delete', 'OPTION_ASSIGNMENT', 'MMT_2')
  end

  after :all do
    delete_group(concept_id: @service_option_assignment_group['concept_id'])

    remove_group_permissions(@delete_permissions['concept_id'])
  end

  before do
    service_entries_by_provider_response = Echo::Response.new(Faraday::Response.new(status: 200, body: File.read('spec/fixtures/service_management/service_entries_by_provider.xml')))
    allow_any_instance_of(Echo::ServiceManagement).to receive(:get_service_entries_by_provider).and_return(service_entries_by_provider_response)

    collections_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/cmr_search.json'))))
    allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections_by_post).and_return(collections_response)

    login

    visit service_option_assignments_path

    wait_for_ajax

    within '#service_entries_fromList' do
      # Deimos
      find('option[value="3E5F3D05-C8F5-C540-4484-F3E67A7D5E62"]').select_option

      # Polaris
      find('option[value="A19EDB8C-2253-3B19-E70D-1AC053DAC384"]').select_option
    end

    within '.button-container' do
      find('.add_button').click
    end

    VCR.use_cassette('echo_soap/service_management_service/service_option_assignments/list', record: :none) do
      click_on 'Display Assignments'
    end
  end

  # I've created MMT-789. We've implemented a confirmation modal that is displayed on click
  # of this button. This error message is displayed when 'Yes' is clicked in the modal. This test
  # fails because the modal does not disappear.
  # context 'when clicking delete without any assignments selected' do
  #   before do
  #     click_on 'Delete Selected Assignments'
  #   end

  #   it 'display a validation message' do
  #     expect(page).to have_content('You must select at least 1 assignment.')
  #   end
  # end

  context 'when authorized to delete service entries' do
    context 'when clicking delete with assignments selected' do
      before do
        within '#service-option-assignments' do
          first("td input[type='checkbox']").set(true)
        end

        click_on 'Delete Selected Assignments'
      end

      it 'displays a confirmation dialog' do
        expect(page).to have_content('Are you sure you want to delete the selected service option assignments?')
      end

      context 'When declining the confirmation dialog' do
        before do
          click_on 'No'
        end

        it 'closes the dialog and does not delete the order option assignments' do
          expect(page).to have_content('MMT_2 Service Option Assignments')
        end
      end

      context 'when accepting the confirmation dialog' do
        before do
          VCR.use_cassette('echo_soap/service_management_service/service_option_assignments/delete', record: :none) do
            click_on 'Yes'
          end
        end

        it 'deletes the selected assignment' do
          expect(page).to have_content('Successfully deleted the selected service option assignments.')
        end
      end
    end
  end
end
