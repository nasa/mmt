require 'rails_helper'

describe 'Filtering groups', reset_provider: true, js: true do
  context 'when viewing the groups page' do
    before do
      login

      visit groups_path
      click_on 'New Group'
      fill_in 'Group Name', with: 'Group 1'
      fill_in 'Group Description', with: 'test group'
      select('Alien Bobcat', from: 'Members directory')
      click_on 'Add Member(s)'
      click_on 'Save'

      visit groups_path
      click_on 'New Group'
      fill_in 'Group Name', with: 'Group 2'
      fill_in 'Group Description', with: 'test group 2'
      select('Alien Bobcat', from: 'Members directory')
      select('Quail Racoon', from: 'Members directory')
      click_on 'Add Member(s)'
      click_on 'Save'
      sleep 1

      visit groups_path
    end

    context 'when searching by provider' do
      before do
        select 'MMT_2', from: 'Provider'
        click_on 'Apply Filter'
      end

      it 'displays the search params' do
        expect(page).to have_css('li.select2-selection__choice', text: 'MMT_2')
      end

      it 'displays the search results' do
        within '.groups-table' do
          within all('tr')[1] do
            expect(page).to have_content('Group 1 MMT_2 1')
          end
          within all('tr')[2] do
            expect(page).to have_content('Group 2 MMT_2 2')
          end
        end
      end
    end

    context 'when searching by member' do
      before do
        select 'abcd', from: 'Member'
        select 'qrst', from: 'Member'
        click_on 'Apply Filter'
      end

      it 'displays the search params' do
        expect(page).to have_css('li.select2-selection__choice', text: 'abcd')
        expect(page).to have_css('li.select2-selection__choice', text: 'qrst')
      end

      it 'displays the search results' do
        within '.groups-table' do
          within all('tr')[1] do
            expect(page).to have_content('Group 2 MMT_2 2')
          end
        end
        expect(page).to have_no_content('SEDAC Test Group')
      end
    end
  end
end
