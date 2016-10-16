# MMT-507

require 'rails_helper'

describe 'New Permission', reset_provider: true, js: true do
  permission_name = 'James-Test-Permission-1'

  context 'When visiting new permission page' do
    before do
      login

      visit new_permission_path
    end

    it 'indicates this is a new permission page' do
      expect(page).to have_content('New Permission')
    end

    it 'displays the new permission entry fields' do
      expect(page).to have_field('Name', type: 'text')
      expect(page).to have_field('Collections', type: 'select')
      expect(page).to have_field('Granules', type: 'select')
      expect(page).to have_field('Search', type: 'select', visible: false)
      expect(page).to have_field('Search and Order', type: 'select', visible: false)
    end

    context 'when creating a new permission with complete information' do
      # TODO do one with only one group in Search or Search and Order, one with both
      context 'when creating a permission with a group chosen for ___'
      context 'when creating a permission with groups chosen for both ___'

      before do
        page.document.synchronize do
          # add group
          visit new_group_path
          fill_in 'Group Name', with: 'Group 1'
          fill_in 'Group Description', with: 'test group 1'
          click_on 'Save'
          wait_for_ajax
          expect(page).to have_content('Group 1')

          visit new_permission_path
          fill_in 'Name', with: permission_name
          select('All Collections', from: 'Collections')
          select('All Granules', from: 'Granules')

          within '#groups-table2' do
            select('Group 1', from: 'Search')
            select('Group 1', from: 'Search and Order')
          end
        end

        click_on 'Save'

        expect(page).to have_content('Custom Permissions')
      end

      it 'displays a success message that a new permission was added' do
        expect(page).to have_content('Permission was successfully created.')
      end

      it 'displays the permission on the page' do
        within '#custom-permissions-table' do
          expect(page).to have_content('James-Test-Permission-1')
          expect(page).to have_content('Search & Order')
        end
      end

      context 'when creating a permission for registered users' do
        before do
          visit new_permission_path
          # fill in form for permission

          # choose registered users
          # save
        end
      end

      context 'when creating a permission for guest users' do
        before do
          visit new_permission_path
          # fill in form for permission
          # fill_in 'Name', with:

          # choose guest users
          # save
        end

        # display a success message? I am against it right now - tested above, want to minimize

        it 'displays the permission on the page'

        # should I inspect the permission somehow?
        # make sure the permission says guest users?
        # => add a comment to add a test to visit permission page after show is created.
        it 'shows the permission is for guest users on the permission page'
      end
    end

    context 'when attempting to create a permission with incomplete information' do
      # TODO this is the new context. should be able to streamline the the tests with errors
      before do
        click_on 'Save'
      end

      it 'displays validation errors on the form'
    end

    context 'when attempting to create a permission with incomplete collection or granule information' do

      # TODO - should be able to take this out
      it 'displays the appropriate error message' do
        visit new_permission_path
        fill_in 'Name', with: permission_name
        click_on 'Save'
        expect(page).to have_content('Search Collections must be specified.')
      end
    end

    context 'when attempting to create a permission with incomplete granule information' do
      before do
        fill_in 'Name', with: permission_name
        select('All Collections', from: 'Collections')
        click_on 'Save'
      end
      it 'displays the appropriate error message' do
        expect(page).to have_content('Granules must be specified.')
      end
    end

    context 'when attempting to create a permission with incomplete collection information' do
      before do
        fill_in 'Name', with: permission_name
        select('All Granules', from: 'Granules')
        click_on 'Save'
      end
      it 'displays the appropriate error message' do
        expect(page).to have_content('Collections must be specified.')
      end
    end

    context 'when attempting to create a permission with no groups specified' do
      before do
        fill_in 'Name', with: permission_name
        select('All Granules', from: 'Granules')
        select('All Collections', from: 'Collections')
        click_on 'Save'
      end
      it 'displays the appropriate error message' do
        expect(page).to have_content('Please specify at least one Search group or one Search & Order group.')
      end
    end
  end
end
