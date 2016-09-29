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

    context 'when attempting to create a permission with incomplete information' do
      context 'when saving without a permission name' do
        before do
          fill_in 'Name', with: permission_name
          click_on 'Save'
        end
        it 'displays an error message' do
          expect(page).to have_content('Permission Name is required.')
        end
      end
    end



  end
end
