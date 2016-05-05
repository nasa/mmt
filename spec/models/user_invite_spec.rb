require 'rails_helper'

describe UserInvite do
  before do
    ActionMailer::Base.deliveries.clear
  end

  after do
    ActionMailer::Base.deliveries.clear
  end

  # self.new_invite method
  it '"self.new_invite" creates a new UserInvite' do
    user = {
      'first_name' => 'First Name',
      'last_name' => 'Last Name',
      'email' => 'user@example.com',
      'group_id' => 'group1-MMT_2',
      'group_name' => 'Test Group'
    }
    manager = {
      'name' => 'Manager Name',
      'email' => 'manager@example.com',
      'provider' => 'MMT_2'
    }

    invite = UserInvite.new_invite(user, manager)

    expect(invite).to be_valid
    expect(invite.user_first_name).to eq(user['first_name'])
    expect(invite.user_last_name).to eq(user['last_name'])
    expect(invite.user_email).to eq(user['email'])
    expect(invite.manager_name).to eq(manager['name'])
    expect(invite.manager_email).to eq(manager['email'])
    expect(invite.provider).to eq(manager['provider'])
    expect(invite.group_id).to eq(user['group_id'])
    expect(invite.group_name).to eq(user['group_name'])
    expect(invite.token).to_not be_nil
    expect(invite.active).to eq(true)
  end

  # accept_invite method
  context '"accept_invite" method' do
    let(:invite) { create(:user_invite) }

    it 'sets active to false' do
      invite
      invite.accept_invite(nil, 'testuser', 'access_token')

      expect(invite.active).to eq(false)
    end

    it 'sends an email to the manager' do
      invite
      invite.accept_invite(nil, 'testuser', 'access_token')

      expect(ActionMailer::Base.deliveries.count).to eq(1)
    end
  end

  # send_invite method
  it '"send_invite" sends an email to the user' do
    invite = create(:user_invite)
    invite.send_invite

    expect(ActionMailer::Base.deliveries.count).to eq(1)
  end
end
