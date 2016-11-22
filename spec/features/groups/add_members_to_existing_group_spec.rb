# MMT-151

require 'rails_helper'

describe 'Adding members to existing group', js: true, reset_provider: true do
  group_name = 'Ocean Explorers'
  group_description = 'Group for Ocean Monitoring Scientists'

  context 'when visiting add members page' do
    before do
      login
      visit new_group_path
      fill_in 'Group Name', with: group_name
      fill_in 'Group Description', with: group_description
      click_on 'Save'

      @concept_id = group_concept_from_path

      click_on '+ Add Members'

      select('Marsupial Narwal', from: 'Members directory')
      select('Quail Racoon', from: 'Members directory')
      select('Ukulele Vulcan', from: 'Members directory')
      click_on 'Add Member(s)'
      click_on 'Save'
    end

    after do
      delete_group(concept_id: @concept_id)

      wait_for_cmr
    end

    it 'displays correct data' do
      expect(page).to have_content('Members successfully added.')
    end

    it 'displays the group information' do
      within '#main-content header' do
        expect(page).to have_content(group_name)
        expect(page).to have_content(group_description)
      end
    end

    it 'displays the group members' do
      within '#groups-table' do
        expect(page).to have_content('Marsupial Narwal')
        expect(page).to have_content('Quail Racoon')
        expect(page).to have_content('Ukulele Vulcan')
      end
    end
  end
end
