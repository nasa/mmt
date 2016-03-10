require 'rails_helper'

describe 'Groups list page', js: true, reset_provider: true do
  context 'when viewing the groups page' do
    before do
      login
      visit '/groups'
    end

    context 'when there are groups' do
      before do
        # Add some groups
        VCR.use_cassette('groups/page_with_all_URS_users', record: :none) do
          click_on 'New Group'
          fill_in 'Group Name', with: 'Group 1'
          fill_in 'Group Description', with: 'test group'
          click_on 'Save'

          within '.breadcrumb' do
            click_on 'Groups'
          end

          click_on 'New Group'
          fill_in 'Group Name', with: 'Group 2'
          fill_in 'Group Description', with: 'test group 2'
          select('Alien Bobcat', from: 'Members directory')
          click_on 'Add Member(s)'
          click_on 'Save'
          sleep 1

          within '.breadcrumb' do
            click_on 'Groups'
          end
        end
      end

      it 'displays a list of groups' do
        within '.groups-table' do
          within all('tr')[1] do
            expect(page).to have_content('Group 1 MMT_2 0')
          end
          within all('tr')[2] do
            expect(page).to have_content('Group 2 MMT_2 1')
          end
        end
      end
    end

    context 'when there are no groups' do
      it 'does not show any groups' do
        expect(page).to have_content('No groups found at this time.')
      end
    end
  end
end
