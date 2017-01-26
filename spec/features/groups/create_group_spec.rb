require 'rails_helper'

describe 'Groups', reset_provider: true do
  before :all do
    @group = create_group(
      name: 'Generic Initial Management Group for Tests',
      description: 'Group for Initial Managment Group'
    )
  end

  context 'when visiting the new group form' do
    before do
      login

      visit new_group_path
    end

    it 'displays the new group form' do
      expect(page).to have_content('New MMT_2 Group')

      expect(page).to have_field('Name', type: 'text')
      expect(page).to have_field('Description', type: 'textarea')
      expect(page).to have_field('Initial Management Group', type: 'select')

      expect(page).to have_no_unchecked_field('System Level Group?')
    end

    context 'when submitting an invalid group form', js: true do
      before do
        within '.group-form' do
          click_on 'Submit'
        end
      end

      it 'displays validation errors within the form' do
        expect(page).to have_content('Name is required.')
        expect(page).to have_content('Description is required.')
        expect(page).to have_content('Initial Management Group is required.')
      end
    end

    context 'when submitting the form without errors' do
      context 'when submitting the form with members', js: true do
        let(:group_name)        { 'NASA Test Group With Members' }
        let(:group_description) { 'NASA is seriously the coolest, with the coolest members!' }
        let(:initial_management_group) { 'Generic Initial Management Group for Tests' }

        before do
          fill_in 'Name', with: group_name
          fill_in 'Description', with: group_description
          select(initial_management_group, from: 'Initial Management Group')

          select('Marsupial Narwal', from: 'Members Directory')
          select('Quail Racoon', from: 'Members Directory')
          select('Ukulele Vulcan', from: 'Members Directory')
          click_on 'Add Member(s)'

          within '.group-form' do
            click_on 'Submit'
          end

          wait_for_cmr
        end

        it 'saves the group with members' do
          expect(page).to have_content('Group was successfully created.')
          expect(page).to have_content(initial_management_group)

          within '#group-members' do
            expect(page).to have_selector('tbody > tr', count: 3)
          end
        end
      end

      context 'when submitting the form without members' do
        let(:group_name)        { 'NASA Test Group' }
        let(:group_description) { 'NASA is seriously the coolest.' }
        let(:initial_management_group) { 'Generic Initial Management Group for Tests' }

        before do
          fill_in 'Name', with: group_name
          fill_in 'Description', with: group_description
          select(initial_management_group, from: 'Initial Management Group')

          within '.group-form' do
            click_on 'Submit'
          end

          wait_for_cmr
        end

        it 'saves the group without members' do
          expect(page).to have_content('Group was successfully created.')

          expect(page).to have_content(initial_management_group)

          expect(page).not_to have_selector('table.group-members')
          expect(page).to have_content("#{group_name} has no members.")
        end
      end

      context 'when there is an error creating the single instance identity acl' do
        let(:group_name) { random_group_name }
        let(:group_description) { random_group_description }
        let(:initial_management_group) { 'Generic Initial Management Group for Tests' }

        before do
          fill_in 'Name', with: group_name
          fill_in 'Description', with: group_description
          select(initial_management_group, from: 'Initial Management Group')

          # mock for error creating single instance identity acl
          mock_group_management_error = '{"errors":["The Acl Identity [single-instance:ag1200000180-mmt_1:group_management] must be unique. The following concepts with the same acl identity were found: [ACL1200000181-CMR]."]}'
          management_group_response = Cmr::Response.new(Faraday::Response.new(status: 401, body: JSON.parse(mock_group_management_error)))
          allow_any_instance_of(Cmr::CmrClient).to receive(:add_group_permissions).and_return(management_group_response)

          within '.group-form' do
            click_on 'Submit'
          end

          wait_for_cmr
        end

        it 'shows the form for a new group with the previously entered data' do
          expect(page).to have_field('Name', with: group_name, readonly: false)
          expect(page).to have_field('Description', with: group_description)
          expect(page).to have_select('Initial Management Group', disabled: false)
          expect(page).to have_select('Initial Management Group', selected: 'Generic Initial Management Group for Tests')
        end

      end

      context 'when there is an error creating the single instance identity acl AND then deleting the group' do
        let(:group_name) { random_group_name }
        let(:group_description) { random_group_description }
        let(:initial_management_group) { 'Generic Initial Management Group for Tests' }

        before do
          fill_in 'Name', with: group_name
          fill_in 'Description', with: group_description
          select(initial_management_group, from: 'Initial Management Group')

          # mock for error creating single instance identity acl
          mock_group_management_error = '{"errors":["The Acl Identity [single-instance:ag1200000180-mmt_1:group_management] must be unique. The following concepts with the same acl identity were found: [ACL1200000181-CMR]."]}'
          management_group_response = Cmr::Response.new(Faraday::Response.new(status: 401, body: JSON.parse(mock_group_management_error)))
          allow_any_instance_of(Cmr::CmrClient).to receive(:add_group_permissions).and_return(management_group_response)

          # mock for error deleting group
          mock_group_delete_error = '{"errors":["You do not have permission to delete access control group [Test Groupy Group]."]}'
          group_delete_response = Cmr::Response.new(Faraday::Response.new(status: 401, body: JSON.parse(mock_group_delete_error)))
          allow_any_instance_of(Cmr::CmrClient).to receive(:delete_group).and_return(group_delete_response)

          within '.group-form' do
            click_on 'Submit'
          end

          wait_for_cmr
        end

        it 'redirects to the created group but displays an error message' do
          expect(page).to have_content(group_name)
          expect(page).to have_content(group_description)

          expect(page).to have_content('was created but there were issues with the Initial Management Group permissions. Please delete this group and try again.')
          expect(page).to have_no_content(initial_management_group)
        end
      end
    end
  end
end
