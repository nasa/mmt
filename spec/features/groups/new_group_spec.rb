# MMT-150

require 'rails_helper'

describe 'New Groups', reset_provider: true, js: true do
  group_name = 'Forest People'
  group_description = 'Group for scientists monitoring Forest Cover'

  context 'when visiting the new group page' do
    before do
      login
      visit new_group_path
    end

    it 'displays the new group information entry fields' do
      expect(page).to have_field('Group Name', type: 'text')
      expect(page).to have_field('Group Description', type: 'textarea')
    end

    it 'indicates new group is for the current provider' do
      expect(page).to have_content('New Group for MMT_2')
    end

    context 'when attempting to create a group with incomplete information' do
      context 'when saving without a Group Name' do
        before do
          fill_in 'Group Description', with: group_description
          click_on 'Save'
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
          click_on 'Save'
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
          click_on 'Save'
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

    context 'when creating a new group with valid information' do
      before do
        fill_in 'Group Name', with: group_name
        fill_in 'Group Description', with: group_description
        click_on 'Save'
      end

      it 'displays a success message' do
        expect(page).to have_content('Group was successfully created.')
      end

      it 'displays the group information' do
        within '#main-content header' do
          expect(page).to have_content(group_name)
          expect(page).to have_content(group_description)
        end
      end
    end
  end
end
