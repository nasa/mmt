# MMT-151

require 'rails_helper'

describe 'Updating groups', reset_provider: true, js: true do
  before do
    @group = create_group

    login
  end

  context 'when visiting edit group form' do
    before do
      visit edit_group_path(@group['concept_id'])
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
        # message should only show if there are members that have not authorized MMT
        expect(page).to have_no_content('MMT cannot populate empty member information cells because those users have not authorized MMT to access their Earthdata Login profile.')
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
          # message should only show if there are members that have not authorized MMT
          expect(page).to have_no_content('MMT cannot populate empty member information cells because those users have not authorized MMT to access their Earthdata Login profile.')
        end
      end
    end

  end

  context 'when viewing a group that has group members that have not authorized MMT' do
    before do
      response = cmr_client.add_group_members(@group['concept_id'], ['non_auth_user_1', 'non_auth_user_2'], 'access_token')

      visit group_path(@group['concept_id'])
    end

    it 'shows the group information and members, including users that have not authorized MMT' do
      expect(page).to have_content(@group['name'])
      expect(page).to have_content(@group['description'])

      within '#group-members' do
        expect(page).to have_selector('tbody > tr', count: 2)
        expect(page).to have_content('non_auth_user_1')
        expect(page).to have_content('non_auth_user_2')
      end
      expect(page).to have_content('MMT cannot populate empty member information cells because those users have not authorized MMT to access their Earthdata Login profile.')
    end

    context 'when updating the group' do
      before do
        visit edit_group_path(@group['concept_id'])

        fill_in 'Description', with: 'New Testing Description'
        select('Alien Bobcat', from: 'Members Directory')
        select('Quail Racoon', from: 'Members Directory')
        click_on 'Add Member(s)'

        within '.group-form' do
          click_on 'Submit'
        end
      end

      it 'shows the updated description, new members, and non authorized group members' do
        expect(page).to have_content('New Testing Description')

        within '#group-members' do
          expect(page).to have_selector('tbody > tr', count: 4)
          expect(page).to have_content('Alien Bobcat aaaa.dddd@nasa.gov abcd')
          expect(page).to have_content('Quail Racoon qqqq.rrrr@nasa.gov qrst')

          expect(page).to have_content('non_auth_user_1')
          expect(page).to have_content('non_auth_user_2')
        end
        expect(page).to have_content('MMT cannot populate empty member information cells because those users have not authorized MMT to access their Earthdata Login profile.')
      end
    end
  end
end
