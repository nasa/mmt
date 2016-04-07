require 'rails_helper'

describe 'Inviting users', reset_provider: true, js: true do
  let(:token) { UserInvite.first.token }

  after do
    ActionMailer::Base.deliveries.clear
  end

  context 'when creating a new group' do
    before do
      login
      visit new_group_path
      fill_in 'Group Name', with: 'Test Group'
      fill_in 'Group Description', with: 'Test Description'
    end

    context 'when inviting a user' do
      before do
        click_on 'Member not listed'

        fill_in 'invite_first_name', with: 'First'
        fill_in 'invite_last_name', with: 'Last'
        fill_in 'invite_email', with: 'test@example.com'

        click_on 'Invite User'
        wait_for_ajax

        token
      end

      it 'creates a new UserInvite' do
        expect(UserInvite.count).to eq(1)
      end

      it 'sends the user an email' do
        expect(ActionMailer::Base.deliveries.count).to eq(1)
      end

      it 'clears the form' do
        expect(page).to have_field('invite_first_name', with: '')
        expect(page).to have_field('invite_last_name', with: '')
        expect(page).to have_field('invite_email', with: '')
      end

      it 'displays a confirmation message' do
        expect(page).to have_content('Invitation sent!')
      end

      context 'when the user accepts the invite' do
        before do
          visit accept_invite_path(token: token)
        end

        it 'sets the UserInvite to inactive' do
          expect(UserInvite.first.active).to eq(false)
        end

        it 'displays a confirmation page' do
          expect(page).to have_content('Thank you for accepting this invitation. Group managers will now be able to add you to groups.')
        end

        it 'emails the manager' do
          expect(ActionMailer::Base.deliveries.count).to eq(2)
        end
      end
    end
  end

  context 'when adding users to an existing group' do
    before do
      login
      visit new_group_path
      fill_in 'Group Name', with: 'Test Group'
      fill_in 'Group Description', with: 'Test Description'
      click_on 'Save'

      click_on 'Add Members'
    end

    context 'when inviting a user' do
      before do
        click_on 'Member not listed'

        fill_in 'invite_first_name', with: 'First'
        fill_in 'invite_last_name', with: 'Last'
        fill_in 'invite_email', with: 'test@example.com'

        click_on 'Invite User'
        wait_for_ajax

        token
      end

      it 'creates a new UserInvite' do
        expect(UserInvite.count).to eq(1)
      end

      it 'sends the user an email' do
        expect(ActionMailer::Base.deliveries.count).to eq(1)
      end

      it 'clears the form' do
        expect(page).to have_field('invite_first_name', with: '')
        expect(page).to have_field('invite_last_name', with: '')
        expect(page).to have_field('invite_email', with: '')
      end

      it 'displays a confirmation message' do
        expect(page).to have_content('Invitation sent!')
      end

      context 'when the user accepts the invite' do
        before do
          visit accept_invite_path(token: token)
        end

        it 'sets the UserInvite to inactive' do
          expect(UserInvite.first.active).to eq(false)
        end

        it 'displays a confirmation page' do
          expect(page).to have_content('Thank you for accepting this invitation. Group managers will now be able to add you to groups.')
        end

        it 'emails the manager' do
          expect(ActionMailer::Base.deliveries.count).to eq(2)
        end

        it 'adds the user to the group' do
          expect(page).to have_content('You have been added to the group Test Group in MMT_2')
        end
      end
    end
  end
end
