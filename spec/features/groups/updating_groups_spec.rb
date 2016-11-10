require 'rails_helper'

describe 'Updating groups', reset_provider: true, js: true do
  context 'when editing a group' do
    before do
      login
      visit new_group_path

      fill_in 'Group Name', with: 'Test group'
      fill_in 'Group Description', with: 'description'
      click_on 'Save'
      click_on 'Edit Group'
    end

    context 'when the user updates the description' do
      before do
        fill_in 'Group Description', with: 'New description'
        click_on 'Save'
      end

      it 'displays the new group information' do
        within '#main-content header' do
          expect(page).to have_content('Test group')
          expect(page).to have_content('New description')

          # does not have SYS badge
          expect(page).to have_no_content('SYS')
          expect(page).to have_no_css('span.eui-badge--sm')
        end
      end
    end

    context 'when the user removes the description' do
      before do
        fill_in 'Group Description', with: ''
        click_on 'Save'
      end

      it 'displays an error message' do
        expect(page).to have_content('Group Description is required.')
      end
    end
  end
end
