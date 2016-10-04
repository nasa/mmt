# MMT-507

require 'rails_helper'

describe 'New Permission', reset_provider: true, js: true do
  permission_name = 'James-Test-Permission-1'
  collection_opt = "all-collections"
  granules_opt = "all-granules"
  search_group = 'James-Test-Group-1'
  search_and_order_group = 'James-Test-Group-1'



  context 'When visiting new permission page' do
    before do
      login

      visit new_group_path
      fill_in 'Group Name', with: 'Group 1'
      fill_in 'Group Description', with: 'test group 1'
      click_on 'Save'

      visit new_group_path
      fill_in 'Group Name', with: 'Group 2'
      fill_in 'Group Description', with: 'test group 2'
      click_on 'Save'

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
          fill_in 'Name', with: permission_name
          select('All Collections', from: 'Collections')
          select('All Granules', from: 'Granules')

          within('#search_groups_cell') do
            find('.select2-container .select2-selection').click
            find(:xpath, '//body').find('.select2-dropdown li.select2-results__option', text: 'Group 1').click
          end

          within('#search_and_order_groups_cell') do
            find('.select2-container .select2-selection').click
            find(:xpath, '//body').find('.select2-dropdown li.select2-results__option', text: 'Group 2').click
          end

          click_on 'Save'
        end

        it 'indicates success that a new permission was added' do
          expect(page).to have_content('Permission was successfully created.')
        end


    end



    context 'when attempting to create a permission with incomplete information' do
      context 'when saving without collection information' do
        before do
          visit new_permission_path
          fill_in 'Name', with: permission_name
          click_on 'Save'
        end
        it 'displays an error message' do
          expect(page).to have_content('Search Collections must be specified.')
        end
      end
    end
=begin
    context 'when attempting to create a permission with partial information' do
      context 'when saving without collections' do
        before do
          fill_in 'Name', with: permission_name
          click_on 'Save'
        end
        it 'displays an error message' do
          expect(page).to have_content('Permission Name is required.')
        end
      end
    end

    context 'when attempting to create a permission with partial information' do
      context 'when saving without granules' do
        before do
          fill_in 'Name', with: permission_name
          click_on 'Save'
        end
        it 'displays an error message' do
          expect(page).to have_content('Permission Name is required.')
        end
      end
    end

    context 'when attempting to create a permission with partial information' do
      context 'when saving without collections' do
        before do
          fill_in 'Name', with: permission_name
          click_on 'Save'
        end
        it 'displays an error message' do
          expect(page).to have_content('Permission Name is required.')
        end
      end
    end

    context 'when attempting to create a permission with existing name' do
      context 'when saving without collections' do
        before do
          fill_in 'Name', with: permission_name
          click_on 'Save'
        end
        it 'displays an error message' do
          expect(page).to have_content('Permission Name is required.')
        end
      end
    end
=end


  end
end
