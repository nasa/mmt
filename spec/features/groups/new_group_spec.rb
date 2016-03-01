# MMT-150, MMT-151

require 'rails_helper'

describe 'New Groups', reset_provider: true, js: true do
  group_name = 'Forest People'
  group_description = 'Group for scientists monitoring Forest Cover'

  context 'when visiting the new group page' do
    before do
      login
      VCR.use_cassette('groups/page_with_all_URS_users', record: :none) do
        # will raise error about Faraday HTTP adapter, see https://github.com/vcr/vcr/issues/159
        visit new_group_path
      end
    end

    it 'displays the new group information entry fields' do
      expect(page).to have_field('Group Name', type: 'text')
      expect(page).to have_field('Group Description', type: 'textarea')
    end

    it 'indicates new group is for the current provider' do
      expect(page).to have_content('New Group for MMT_2')
    end

    it 'has dual select box for adding members to group' do
      expect(page).to have_css('.dual-select #members_directory')
      expect(page).to have_css('.dual-select #selected_members')
    end

    context 'when attempting to create a group with incomplete information' do
      context 'when saving without a Group Name' do
        before do
          fill_in 'Group Description', with: group_description
          VCR.use_cassette('groups/page_with_all_URS_users', record: :none) do
            click_on 'Save'
          end
        end

        it 'displays the correct error message' do
          expect(page).to have_content('Group Name is required.')
        end

        it 'remembers the entered information' do
          expect(page).to have_field('Group Description', with: group_description)
        end
      end

      context 'when saving without a description' do
        before do
          fill_in 'Group Name', with: group_name
          VCR.use_cassette('groups/page_with_all_URS_users', record: :none) do
            click_on 'Save'
          end
        end

        it 'displays the correct error message' do
          expect(page).to have_content('Group Description is required.')
        end

        it 'remembers the entered information' do
          expect(page).to have_field('Group Name', with: group_name)
        end
      end

      context 'when saving without name or description' do
        before do
          VCR.use_cassette('groups/page_with_all_URS_users', record: :none) do
            click_on 'Save'
          end
        end

        it 'displays the correct error message' do
          expect(page).to have_content('Group Name and Description are required.')
        end
      end

      context 'when not filling in required fields' do
        context 'when not filling in group name' do
          before do
            page.execute_script("$('#group_name').trigger('blur')")
          end

          it 'displays in line validation error' do
            within '.group-form' do
              expect(page).to have_css('.validation-error')
              expect(page).to have_content('Group Name is required.')
            end
          end

          context 'when then filling in group name' do
            before do
              fill_in 'Group Name', with: group_name
              page.execute_script("$('#group_name').trigger('blur')")
            end

            it 'validation error goes away' do
              expect(page).to have_no_css('.validation-error')
              expect(page).to have_no_content('Group Name is required.')
            end
          end
        end

        context 'when not filling in group description' do
          before do
            page.execute_script("$('#group_description').trigger('blur')")
          end

          it 'displays in line validation error' do
            within '.group-form' do
              expect(page).to have_css('.validation-error')
              expect(page).to have_content('Group Description is required.')
            end
          end

          context 'when then filling in group description' do
            before do
              fill_in 'Group Description', with: group_description
              page.execute_script("$('#group_description').trigger('blur')")
            end

            it 'validation error goes away' do
              expect(page).to have_no_css('.validation-error')
              expect(page).to have_no_content('Group Description is required.')
            end
          end
        end
      end
    end

    context 'when using the dual select box to add members' do
      before do
        # choose one user
        select('Adam Bobcat', :from => 'Members directory')
        click_on 'Add Member(s)'

        # choose multiple users
        select('Marsupial Narwal', :from => 'Members directory')
        select('Quail Racoon', :from => 'Members directory')
        select('Ukulele Vulcan', :from => 'Members directory')
        click_on 'Add Member(s)'
      end

      it 'moves users from member directory to selected members' do
        # members aren't in directory
        within ('#members_directory') do
          expect(page).to have_no_content('Adam Bobcat')
          expect(page).to have_no_content('Marsupial Narwal')
          expect(page).to have_no_content('Quail Racoon')
          expect(page).to have_no_content('Ukulele Vulcan')
        end

        # members are in selected members
        within ('#selected_members') do
          expect(page).to have_content('Adam Bobcat')
          expect(page).to have_content('Marsupial Narwal')
          expect(page).to have_content('Quail Racoon')
          expect(page).to have_content('Ukulele Vulcan')
        end
      end

      context 'when removing members from selected members' do
        before do
          # one user
          select('Adam Bobcat', :from => 'Selected Members')
          click_on 'Remove Member(s)'

          # multiple users
          select('Marsupial Narwal', :from => 'Selected Members')
          select('Quail Racoon', :from => 'Selected Members')
          select('Ukulele Vulcan', :from => 'Selected Members')
          click_on 'Remove Member(s)'
        end

        it 'removes users from selected members back into member directory' do
          # members aren't in selected members
          within ('#selected_members') do
            expect(page).to have_no_content('Adam Bobcat')
            expect(page).to have_no_content('Marsupial Narwal')
            expect(page).to have_no_content('Quail Racoon')
            expect(page).to have_no_content('Ukulele Vulcan')
          end

          # members are in directory
          within ('#members_directory') do
            expect(page).to have_content('Adam Bobcat')
            expect(page).to have_content('Marsupial Narwal')
            expect(page).to have_content('Quail Racoon')
            expect(page).to have_content('Ukulele Vulcan')
          end
        end
      end
    end

    context 'when creating a new group with valid information' do
      before do
        fill_in 'Group Name', with: group_name
        fill_in 'Group Description', with: group_description
      end

      context 'when no members are added' do
        before do
          VCR.use_cassette('groups/page_with_all_URS_users', record: :none) do
            click_on 'Save'
          end
        end

        it 'displays the group information' do
          within '#main-content header' do
            expect(page).to have_content(group_name)
            expect(page).to have_content(group_description)
          end
        end

        it 'displays a success message' do
          expect(page).to have_content('Group was successfully created.')
        end

        it 'does not have any members' do
          within '#groups-table tbody' do
            expect(page).to have_no_css('tr td')
          end
        end
      end

      context 'when members are added' do
        before do
          select('Marsupial Narwal', :from => 'Members directory')
          select('Quail Racoon', :from => 'Members directory')
          select('Ukulele Vulcan', :from => 'Members directory')
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

        it 'has members' do
          within '#groups-table' do
            expect(page).to have_content('Marsupial Narwal')
            expect(page).to have_content('Quail Racoon')
            expect(page).to have_content('Ukulele Vulcan')
          end
        end
      end
    end
  end
end
