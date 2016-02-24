# MMT-150

require 'rails_helper'

describe 'New Groups', js: true, reset_provider: true do
  group_name = 'Forest People'
  group_description = 'Group for scientists monitoring Forest Cover'

  context 'when visiting the new group page' do
    before do
      login
      visit new_group_path
    end

    it 'displays the new group information entry fields' do
      expect(page).to have_field('Group Name', type: 'text')
      expect(page).to have_field('Group Description', type: 'textarea')
    end

    it 'indicates new group is for the current provider' do
      expect(page).to have_content('New Group for MMT_2')
    end

    context 'when attempting to create a group with incomplete information' do
      context 'when attempting without a Group Name' do
        before do
          fill_in 'Group Description', with: group_description
          click_on 'Save'
        end

        it 'displays the correct error message' do
          expect(page).to have_content('Group Name is required.')
        end

        it 'remembers the entered information' do
          expect(page).to have_field('Group Description', with: group_description)
        end
      end

      context 'when attempting without a description' do
        before do
          fill_in 'Group Name', with: group_name
          click_on 'Save'
        end

        it 'displays the correct error message' do
          expect(page).to have_content('Group Description is required.')
        end

        it 'remembers the entered information' do
          expect(page).to have_field('Group Name', with: group_name)
        end
      end

      context 'when attempting without name or description' do
        before do
          click_on 'Save'
        end

        it 'displays the correct error message' do
          expect(page).to have_content('Group Name and Description are required.')
        end
      end
    end

    context 'when creating a new group with valid information' do
      before do
        fill_in 'Group Name', with: group_name
        fill_in 'Group Description', with: group_description
        click_on 'Save'
      end

      it 'displays a success message' do
        expect(page).to have_content('Group was successfully created.')
      end

      it 'displays the group information' do
        expect(page).to have_content(group_name)
        expect(page).to have_content(group_description)
      end
    end
  end
end
