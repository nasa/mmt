require 'rails_helper'

describe 'Groups', reset_provider: true do
  context 'when visiting the new group form' do
    before do
      login

      visit new_group_path
    end

    it 'displays the new group form' do
      expect(page).to have_content('New MMT_2 Group')

      expect(page).to have_field('Name', type: 'text')
      expect(page).to have_field('Description', type: 'textarea')

      expect(page).to have_no_unchecked_field('System Level Group?')
    end

    context 'when submitting an invalid group form', js: true do
      before do
        within '.group-form' do
          click_on 'Submit'
        end
      end

      it 'displays validation errors within the form' do
        expect(page).to have_content('Name is required.')
        expect(page).to have_content('Description is required.')
      end
    end

    context 'when submitting the form without errors' do
      context 'when submitting the form with members', js: true do
        let(:group_name)        { 'NASA Test Group With Members' }
        let(:group_description) { 'NASA is seriously the coolest, with the coolest members!' }

        before do
          fill_in 'Name', with: group_name
          fill_in 'Description', with: group_description

          select('Marsupial Narwal', from: 'Members Directory')
          select('Quail Racoon', from: 'Members Directory')
          select('Ukulele Vulcan', from: 'Members Directory')
          click_on 'Add Member(s)'

          within '.group-form' do
            click_on 'Submit'
          end

          wait_for_cmr
        end

        it 'saves the group with members' do
          expect(page).to have_content('Group was successfully created.')

          within '#group-members' do
            expect(page).to have_selector('tbody > tr', count: 3)
          end
        end
      end

      context 'when submitting the form without members' do
        let(:group_name)        { 'NASA Test Group no members' }
        let(:group_description) { 'NASA is seriously the coolest.' }

        before do
          fill_in 'Name', with: group_name
          fill_in 'Description', with: group_description

          within '.group-form' do
            click_on 'Submit'
          end

          wait_for_cmr
        end

        it 'saves the group without members' do
          expect(page).to have_content('Group was successfully created.')

          expect(page).not_to have_selector('table.group-members')
          expect(page).to have_content("#{group_name} has no members.")
        end
      end
    end
  end
end
