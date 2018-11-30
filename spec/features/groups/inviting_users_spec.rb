require 'rails_helper'

describe 'Inviting users', reset_provider: true, js: true do
  let(:token) { UserInvite.first.token }
  before { skip('feature currently disabled') unless Rails.configuration.invite_users_enabled }

  before do
    ActionMailer::Base.deliveries.clear
  end

  after do
    ActionMailer::Base.deliveries.clear
  end

  context 'when creating a new group' do
    before do
      login

      visit new_group_path

      fill_in 'Name', with: 'Test Group'
      fill_in 'Description', with: 'Test Description'
    end

    context 'when inviting a user' do
      before do
        click_on 'Member not listed'

        fill_in 'invite_first_name', with: 'Execktamwrwcqs'
        fill_in 'invite_last_name', with: '02Wvhznnzjtrunff'
        fill_in 'invite_email', with: 'pvblvweo@hqdybllrn.sghjz'

        click_on 'invite-user-button'

        wait_for_jQuery

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
          VCR.use_cassette('urs/search/q6ddmkhivmuhk-email', record: :none) do
            visit accept_invite_path(token: token)
          end
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
    before :all do
      @group_name = 'Test Group For New Invites'
      @group_description = 'Group to invite users to'
      @provider_id = 'MMT_2'

      @group = create_group(
        name: @group_name,
        description: @group_description,
        provider_id: @provider_id
      )
    end

    before do
      login

      VCR.use_cassette('urs/q6ddmkhivmuhk', record: :none) do
        visit edit_group_path(@group['concept_id'])
      end
    end

    context 'when inviting a user' do
      before do
        click_on 'Member not listed'

        fill_in 'invite_first_name', with: 'Execktamwrwcqs'
        fill_in 'invite_last_name', with: '02Wvhznnzjtrunff'
        fill_in 'invite_email', with: 'pvblvweo@hqdybllrn.sghjz'

        VCR.use_cassette('urs/search/q6ddmkhivmuhk', record: :none) do
          click_on 'invite-user-button'
        end

        wait_for_jQuery

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
          VCR.use_cassette('urs/search/q6ddmkhivmuhk-email', record: :none) do
            visit accept_invite_path(token: token)
          end
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
          expect(page).to have_content("You have been added to the group #{@group_name} in #{@provider_id}")
        end
      end
    end
  end
end
