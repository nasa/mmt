# MMT-151

require 'rails_helper'

describe 'Adding Members to New Groups', reset_provider: true, js: true do
  group_name = 'Ocean Explorers'
  group_description = 'Group for Ocean Monitoring Scientists'

  context 'when visiting new group page' do
    before do
      login
      VCR.use_cassette('groups/page_with_all_URS_users', record: :none) do
        # will raise error about Faraday HTTP adapter, see https://github.com/vcr/vcr/issues/159
        visit new_group_path
      end
    end

    context 'when using the dual select box to add members' do
      before do
        # choose one user
        select('Alien Bobcat', from: 'Members directory')
        click_on 'Add Member(s)'

        # choose multiple users
        select('Marsupial Narwal', from: 'Members directory')
        select('Quail Racoon', from: 'Members directory')
        select('Ukulele Vulcan', from: 'Members directory')
        click_on 'Add Member(s)'
      end

      it 'moves users from member directory to selected members' do
        # members aren't in directory
        within '#members_directory' do
          expect(page).to have_no_content('Alien Bobcat')
          expect(page).to have_no_content('Marsupial Narwal')
          expect(page).to have_no_content('Quail Racoon')
          expect(page).to have_no_content('Ukulele Vulcan')
        end

        # members are in selected members
        within '#selected_members' do
          expect(page).to have_content('Alien Bobcat')
          expect(page).to have_content('Marsupial Narwal')
          expect(page).to have_content('Quail Racoon')
          expect(page).to have_content('Ukulele Vulcan')
        end
      end

      context 'when removing members from selected members' do
        before do
          # one user
          select('Alien Bobcat', from: 'Selected Members')
          click_on 'Remove Member(s)'

          # multiple users
          select('Marsupial Narwal', from: 'Selected Members')
          select('Quail Racoon', from: 'Selected Members')
          select('Ukulele Vulcan', from: 'Selected Members')
          click_on 'Remove Member(s)'
        end

        it 'removes users from selected members back into member directory' do
          # members aren't in selected members
          within '#selected_members' do
            expect(page).to have_no_content('Alien Bobcat')
            expect(page).to have_no_content('Marsupial Narwal')
            expect(page).to have_no_content('Quail Racoon')
            expect(page).to have_no_content('Ukulele Vulcan')
          end

          # members are in directory
          within '#members_directory' do
            expect(page).to have_content('Alien Bobcat')
            expect(page).to have_content('Marsupial Narwal')
            expect(page).to have_content('Quail Racoon')
            expect(page).to have_content('Ukulele Vulcan')
          end
        end
      end
    end

    context 'when creating a new group with valid information and members' do
      before do
        fill_in 'Group Name', with: group_name
        fill_in 'Group Description', with: group_description
        select('Marsupial Narwal', from: 'Members directory')
        select('Quail Racoon', from: 'Members directory')
        select('Ukulele Vulcan', from: 'Members directory')
        click_on 'Add Member(s)'
        VCR.use_cassette('groups/page_with_all_URS_users', record: :none) do
          click_on 'Save'
        end
      end

      it 'displays a success message' do
        expect(page).to have_content('Group was successfully created and members successfully added.')
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
end
