require 'rails_helper'

describe 'Filtering groups', reset_provider: true, js: true do
  before :all do
    group_1 = create_group(
      name: 'Group 1',
      description: 'test group',
      provider_id: 'MMT_2',
      members: %w(abcd)
    )

    group_2 = create_group(
      name: 'Group 2',
      description: 'test group 2',
      provider_id: 'MMT_2',
      members: %w(abcd qrst)
    )
  end

  context 'when viewing the groups page' do
    before do
      login

      visit groups_path
    end

    context 'when searching' do
      context 'by provider' do
        before do
          select 'MMT_2', from: 'Provider'
          click_on 'Apply Filter'
        end

        it 'displays the search params' do
          expect(page).to have_css('li.select2-selection__choice', text: 'MMT_2')

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

      context 'by member' do
        before do
          select 'Alien Bobcat', from: 'Member'
          select 'Quail Racoon', from: 'Member'
          click_on 'Apply Filter'
        end

        it 'displays the search params' do
          expect(page).to have_css('li.select2-selection__choice', text: 'Alien Bobcat')
          expect(page).to have_css('li.select2-selection__choice', text: 'Quail Racoon')

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
end
