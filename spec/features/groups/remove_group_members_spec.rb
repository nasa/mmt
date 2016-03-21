# MMT-154

require 'rails_helper'

describe 'Remove group members', reset_provider: true, js: true do
  group_name = 'Ocean Explorers'
  group_description = 'Group for Ocean Monitoring Scientists'

  context 'when visiting add members page' do
    before do
      login
      visit new_group_path
      fill_in 'Group Name', with: group_name
      fill_in 'Group Description', with: group_description
      click_on 'Save'
      click_on '+ Add Members'

      select('Marsupial Narwal', from: 'Members directory')
      select('Quail Racoon', from: 'Members directory')
      select('Ukulele Vulcan', from: 'Members directory')
      click_on 'Add Member(s)'
      click_on 'Save'
    end

    context 'when removing a member from the group' do
      before do
        all('.remove-member-checkbox')[0].click
        click_on 'Remove Selected'
      end

      it 'removes the member from the group' do
        expect(page).to have_no_content('Marsupial Narwal')
      end
    end

    context 'when selecting the select all checkbox' do
      before do
        find('#select_all_members').click
      end

      it 'selects all the checkboxes' do
        expect(page).to have_selector('input[value="mnop"]:checked')
        expect(page).to have_selector('input[value="qrst"]:checked')
        expect(page).to have_selector('input[value="uvw"]:checked')
      end

      context 'when unselecting the select all checkbox' do
        before do
          find('#select_all_members').click
        end

        it 'unselects all the checkboxes' do
          expect(page).to have_selector('input[value="mnop"]:not(:checked)')
          expect(page).to have_selector('input[value="qrst"]:not(:checked)')
          expect(page).to have_selector('input[value="uvw"]:not(:checked)')
        end
      end
    end
  end
end
