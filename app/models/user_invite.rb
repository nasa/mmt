class UserInvite < ActiveRecord::Base
  before_create :generate_token

  def self.new_invite(user, manager)
    user_invite = UserInvite.new
    user_invite.user_first_name = user['first_name']
    user_invite.user_last_name = user['last_name']
    user_invite.user_email = user['email']
    user_invite.manager_name = manager['name']
    user_invite.manager_email = manager['email_address']
    user_invite.provider = manager['provider']
    user_invite.group_id = user['group_id']
    user_invite.group_name = user['group_name']
    user_invite.save
    user_invite
  end

  def send_invite
    # TODO deliver mail
    GroupMailer.invite_user(self).deliver_now
  end

  private

  def generate_token
    column = :token
    self[column] = loop do
      random_token = SecureRandom.urlsafe_base64(nil, false)
      break random_token unless self.class.exists?(column => random_token)
    end
  end
end
