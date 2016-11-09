# MMT-561
require 'rails_helper'

describe 'System Groups' do
  context 'when viewing new groups form as an admin user' do
    before do
      # login as admin
      login(true)

      visit new_group_path
    end

    it 'shows the system group checkbox' do
      expect(page).to have_content('System Level Group?')
      expect(page).to have_unchecked_field('system_group')
    end

    context 'when clicking the system group checkbox', js: true do
      before do
        check 'System Level Group?'
      end

      it 'changes the New Group header title' do
        within 'main > header .group-header' do
          expect(page).to have_content('New Group for CMR')
          expect(page).to have_content('SYS')
          expect(page).to have_css('span.eui-badge--sm')
        end
      end
    end

    context 'when creating the system level group', js: true do
      sys_group_concept_id = 'AG121111-CMR'
      before do

        # stub for creating group
        group_to_create = {"name"=>"New Test System Group 1", "description"=>"System Group 1 description", "members"=>["abcd", "qrst"]}
        group_create_success = '{"revision_id":1,"concept_id":"AG121111-CMR"}'
        group_creation_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(group_create_success)))
        allow_any_instance_of(Cmr::CmrClient).to receive(:create_group).with(group_to_create, 'access_token_admin').and_return(group_creation_response)

        # stub for retrieving group
        group_retrieval_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/groups/new_system_group.json'))))
        allow_any_instance_of(Cmr::CmrClient).to receive(:get_group).with(sys_group_concept_id, 'access_token_admin').and_return(group_retrieval_response)

        # stub for retrieving group members
        group_members = '["abcd", "qrst"]'
        group_members_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(group_members)))
        allow_any_instance_of(Cmr::CmrClient).to receive(:get_group_members).with(sys_group_concept_id, 'access_token_admin').and_return(group_members_response)

        # fill in group
        fill_in 'Group Name', with: 'New Test System Group 1'
        check 'System Level Group?'
        fill_in 'Group Description', with: 'System Group 1 description'

        # choose users
        select('Alien Bobcat', from: 'Members directory')
        select('Quail Racoon', from: 'Members directory')
        click_on 'Add Member(s)'

        click_on 'Save'
      end

      it 'displays a success message' do
        expect(page).to have_content('Group was successfully created.')
      end

      it 'redirects to the group show page and shows the system level group information' do
        within 'main > header' do
          expect(page).to have_content('New Test System Group 1')
          expect(page).to have_content('System Group 1 description')

          # SYS badge
          expect(page).to have_content('SYS')
          expect(page).to have_css('span.eui-badge--sm')
        end

        within '#groups-table' do
          expect(page).to have_content('Alien Bobcat')
          expect(page).to have_content('Quail Racoon')
        end
      end

      context 'when clicking the edit button for the system level group' do
        before do
          click_on 'Edit Group'
        end

        it 'displays the page and populated fields on the form' do
          within 'main > header' do
            expect(page).to have_content('Edit New Test System Group 1')
            # SYS badge
            expect(page).to have_content('SYS')
            expect(page).to have_css('span.eui-badge--sm')
          end

          expect(page).to have_field('Group Name', with: 'New Test System Group 1')
          expect(page).to have_checked_field('System Level Group?')
          expect(page).to have_field('Group Description', with: 'System Group 1 description')
        end

        it 'has the approprate fields disabled' do
          expect(page).to have_field('Group Name', readonly: true)

          # clicking checkbox should not change anything
          uncheck 'System Level Group?'
          expect(page).to have_checked_field('System Level Group?')
        end

        context 'when updating the system level group' do
          before do
            # stub for update success
            group_update_success = '{"revision_id":2,"concept_id":"AG121111-CMR"}'
            group_update_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(group_update_success)))
            allow_any_instance_of(Cmr::CmrClient).to receive(:update_group).and_return(group_update_response)

            # stub for updated group
            group_retrieval_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/groups/updated_system_group.json'))))
            allow_any_instance_of(Cmr::CmrClient).to receive(:get_group).with(sys_group_concept_id, 'access_token_admin').and_return(group_retrieval_response)

            fill_in 'Group Description', with: 'New system group description'
            click_on 'Save'
          end

          it 'displays a success message' do
            expect(page).to have_content('Group was successfully updated.')
          end

          it 'displays the original and new group information' do
            within 'main > header' do
              expect(page).to have_content('New Test System Group 1')
              expect(page).to have_content('New system group description')

              # SYS badge
              expect(page).to have_content('SYS')
              expect(page).to have_css('span.eui-badge--sm')
            end

            within '#groups-table' do
              expect(page).to have_content('Alien Bobcat')
              expect(page).to have_content('Quail Racoon')
            end
          end
        end
      end

      context 'when removing members from the system level group' do
        before do
          # stub for remove group members
          members_removing = ["qrst"]
          group_remove_members_success = '{"revision_id":3,"concept_id":"AG121111-CMR"}'
          group_remove_members_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(group_remove_members_success)))
          allow_any_instance_of(Cmr::CmrClient).to receive(:remove_group_members).with(sys_group_concept_id, members_removing, 'access_token_admin').and_return(group_remove_members_response)

          # stub for retrieving group members
          group_members = '["abcd"]'
          group_members_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(group_members)))
          allow_any_instance_of(Cmr::CmrClient).to receive(:get_group_members).with(sys_group_concept_id, 'access_token_admin').and_return(group_members_response)

          # remove a member
          all('.remove-member-checkbox')[1].click
          click_on 'Remove Selected'
        end

        it 'displays a success message' do
          expect(page).to have_content('Members successfully removed.')
        end

        it 'contains the member not removed' do
          expect(page).to have_content('Alien Bobcat')
        end

        it 'removes the member from the group' do
          expect(page).to have_no_content('Quail Racoon')
        end
      end
    end
  end

  context 'when viewing the index page with a mix of system level and provider level groups' do
    before do
      #login as admin
      login(true)

      # stub for index groups / get_cmr_groups with a mix of groups
      index_groups_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/groups/sys_groups_index.json'))))
      allow_any_instance_of(Cmr::CmrClient).to receive(:get_cmr_groups).and_return(index_groups_response)

      visit groups_path
    end

    it 'displays the groups table with the group information' do
      within '.groups-table' do
        within all('tr')[1] do
          expect(page).to have_content('LARC Test Group 01 LARC 5')
        end
        within all('tr')[2] do
          expect(page).to have_content('SEDAC Test Group 02 SEDAC 0')
        end
        within all('tr')[3] do
          expect(page).to have_content('Administrators SYS CMR 6')
          expect(page).to have_css('span.eui-badge--sm')
        end
        within all('tr')[4] do
          expect(page).to have_content('Administrators_2 SYS CMR 2')
          expect(page).to have_css('span.eui-badge--sm')
        end
        within all('tr')[5] do
          expect(page).to have_content('CH mmt2 test system group 03 MMT_2 4')
        end
      end
    end
  end
end
