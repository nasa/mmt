# MMT-151

require 'rails_helper'

describe 'Adding members to existing group', reset_provider: true, js: true do
  context 'when visiting edit group form' do
    before do
      group = create_group

      login

      visit edit_group_path(group['concept_id'])
    end

    it 'the name and initial management group fields are disabled' do
      expect(page).to have_field('group_name', readonly: true)
      expect(page).to have_field('Initial Management Group', disabled: true)
    end

    context 'when modifying the description' do
      before do
        fill_in 'Description', with: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.'

        within '.group-form' do
          click_on 'Submit'
        end
      end

      it 'saves the new description' do
        expect(page).to have_content('Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.')
      end
    end

    context 'when removing the description' do
      before do
        fill_in 'Description', with: ''

        within '.group-form' do
          click_on 'Submit'
        end
      end

      it 'displays validation errors within the form' do
        expect(page).to have_content('Description is required.')
      end
    end

    context 'when adding members' do
      before do
        select('Marsupial Narwal', from: 'Members Directory')
        select('Quail Racoon', from: 'Members Directory')
        select('Ukulele Vulcan', from: 'Members Directory')
        click_on 'Add Member(s)'

        within '.group-form' do
          click_on 'Submit'
        end
      end

      it 'displays the group members' do
        expect(page).to have_content('Group was successfully updated.')

        within '#group-members' do
          expect(page).to have_selector('tbody > tr', count: 3)

          expect(page).to have_content('Marsupial Narwal')
          expect(page).to have_content('Quail Racoon')
          expect(page).to have_content('Ukulele Vulcan')
        end
      end

      context 'when removing members' do
        before do
          click_on 'Edit'

          select('Quail Racoon', from: 'Selected Members')
          select('Ukulele Vulcan', from: 'Selected Members')

          click_on 'Remove Member(s)'

          within '.group-form' do
            click_on 'Submit'
          end
        end

        it 'displays only remaining group members' do
          within '#group-members' do
            expect(page).to have_selector('tbody > tr', count: 1)

            expect(page).to have_content('Marsupial Narwal')
          end
        end
      end
    end
  end
end
