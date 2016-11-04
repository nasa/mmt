
require 'rails_helper'

describe 'System Groups', js: true do
  context 'when viewing new groups form as an admin user' do
    before do
      # login as admin

      # visit new group path
    end

    it 'shows the system group checkbox'

    context 'when clicking the system group checkbox' do

      it 'changes the New Group header title'
    end

    context 'when creating the system level group' do
      before do
        # fill in group
        # save
      end

      it 'redirects to the group show page and shows the system level group information'
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
