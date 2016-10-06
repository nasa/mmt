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
      before do
        page.document.synchronize do
          # add group
          visit new_group_path
          fill_in 'Group Name', with: 'Group 1'
          fill_in 'Group Description', with: 'test group 1'
          click_on 'Save'
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
    end

    context 'when attempting to create a permission with incomplete collection or granule information' do

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
