# MMT-507, 152, 153

require 'rails_helper'

describe 'New Permission', reset_provider: true, js: true do
  permission_name = 'James-Test-Permission-1'

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

    context 'when creating a new permission with complete information' do
      context 'when creating a permission with groups' do
        before do
          # TODO create helper method that creates groups with cmr_client method
          # so no need to do it with page/js/etc
          page.document.synchronize do
            # add group
            visit new_group_path
            wait_for_ajax

            fill_in 'Group Name', with: 'Group 1'
            fill_in 'Group Description', with: 'test group 1'
            click_on 'Save'
            expect(page).to have_content('Group 1')
            # screenshot_and_save_page
          end
          # add_group('Group 1', 'test group 1', 'MMT_2')
        end

        context 'when creating a permission for all collections' do
          before do

            visit new_permission_path
            fill_in 'Name', with: permission_name
            select('All Collections', from: 'Collections')
            select('All Granules', from: 'Granules')

            within '#groups-table2' do
              select('Guest Users', from: 'Search')
              select('Guest Users', from: 'Search and Order')
            end

            click_on 'Save'
            expect(page).to have_content('Custom Permissions')
          end

          it 'displays the permission on the page' do
            within '#custom-permissions-table' do
              expect(page).to have_content(permission_name)
              expect(page).to have_content('Search & Order')
            end
          end
        end

        context 'when attempting to create a permission with selected collections' do
          before do
            publish_draft

            visit new_permission_path

            fill_in 'Name', with: permission_name
            select('All Granules', from: 'Granules')
            select('Selected Collections', from: 'Collections')

            # either of these wait methods should work
            wait_for_ajax
            # wait_for_jQuery

            option = first('#collectionsChooser_fromList option').text
            select(option, from: 'Available collections')

            within '#collectionsChooser' do
              find('button[title="add"]').click
            end

            within '#groups-table2' do
              #select('Group 1', from: 'Search and Order')
              select('Guest Users', from: 'Search and Order')
            end

            click_on 'Save'
            expect(page).to have_content('Custom Permissions')
          end

          it 'displays the permission on the page' do
            within '#custom-permissions-table' do
              expect(page).to have_content(permission_name)
              expect(page).to have_content('Search & Order')
            end
          end
        end
      end

      context 'when creating a permission for registered users' do
        before do
          fill_in 'Name', with: permission_name
          select('All Collections', from: 'Collections')
          select('All Granules', from: 'Granules')

          # choose registered users
          select('Registered Users', from: 'Search')

          click_on 'Save'
          expect(page).to have_content('Custom Permissions')
        end

        it 'displays a success message that a new permission was added' do
          expect(page).to have_content('Permission was successfully created.')
        end

        it 'displays the permission on the page' do
          within '#custom-permissions-table' do
            expect(page).to have_content(permission_name)
            expect(page).to have_content('Search')
          end
        end
        # TODO when the permission show page is implemented, we should visit and test that
        # the permission shows the right information so we know it was created correctly
      end

      context 'when creating a permission for guest users' do
        before do
          # visit new_permission_path
          # fill in form for permission
          fill_in 'Name', with: permission_name
          select('All Collections', from: 'Collections')
          select('All Granules', from: 'Granules')

          # choose guest users
          select('Guest Users', from: 'Search and Order')

          click_on 'Save'
          expect(page).to have_content('Custom Permissions')
        end

        it 'displays a success message that a new permission was added' do
          expect(page).to have_content('Permission was successfully created.')
        end

        it 'displays the permission on the page' do
          within '#custom-permissions-table' do
            expect(page).to have_content(permission_name)
            expect(page).to have_content('Search & Order')
          end
        end

        # TODO when the permission show page is implemented, we should visit and test that
        # the permission shows the right information so we know it was created correctly
      end
    end

    context 'when attempting to create a permission with incomplete information' do
      before do
        # should already be on new permission page. click save to produce the inline validation errors
        click_on 'Save'
      end

      it 'displays validation errors on the form' do
        expect(page).to have_content('Permission Name is required.')
        expect(page).to have_content('Granules must be specified.')
        expect(page).to have_content('Collections must be specified.')
        expect(page).to have_content('Please specify at least one Search group or one Search & Order group.')
      end
    end

  end
end
