# MMT-561
require 'rails_helper'

# CMR calls that need to be stubbed:
  # create group
  # get group members
  # add members to group
  # update group
  # remove members from group
  # delete group

describe 'System Groups', js: true do
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

    context 'when clicking the system group checkbox' do
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

    context 'when creating the system level group' do
      sys_group_concept_id = 'AG121111-CMR'
      before do

        # stub for creating group
        group_to_create = {"name"=>"New Test System Group 1", "description"=>"System Group 1 description", "members"=>["abcd", "qrst"]}
        group_create_success = '{"revision_id":1,"concept_id":"ACL121111-CMR"}'
        group_creation_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(group_create_success)))
        puts group_creation_response.inspect
        allow_any_instance_of(Cmr::CmrClient).to receive(:create_group).with(group_to_create, 'access_token_admin').and_return(group_creation_response)
        # allow_any_instance_of(Cmr::CmrClient).to receive(:create_group).and_return(group_creation_response)

        # stub for retrieving group
        group_retrieval_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/groups/new_system_group.json'))))
        puts group_retrieval_response.inspect
        # allow_any_instance_of(Cmr::CmrClient).to receive(:get_group).with(sys_group_concept_id, 'access_token_admin').and_return(group_retrieval_response)
        allow_any_instance_of(Cmr::CmrClient).to receive(:get_group).and_return(group_retrieval_response)

        # stub for retrieving group members
        group_members = '["abcd", "qrst"]'
        group_members_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(group_members)))
        puts group_members_response.inspect
        # allow_any_instance_of(Cmr::CmrClient).to receive(:get_group_members).with(sys_group_concept_id, 'access_token_admin').and_return(group_members_response)
        allow_any_instance_of(Cmr::CmrClient).to receive(:get_group_members).and_return(group_members_response)

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

      it 'redirects to the group show page and shows the system level group information' do
        within '#main-content header' do
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
        # shows the group info
        # shows the badge

      # what about success message?


      context 'when viewing the edit page with the system level group' do
        before do
          # go to edit page
        end

        it 'has the approprate fields disabled'
          # name is readonly
          # clicking checbox does not change anything
      end

      context 'when updating and saving the system level group' do

      end
    end
  end

  context 'when viewing the index page with a mix of system level and provider level groups' do

  end
end
