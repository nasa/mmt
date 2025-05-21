class UserInvite < ApplicationRecord
  before_create :generate_token

  def self.new_invite(user, manager)
    user_invite = UserInvite.new
    user_invite.user_first_name = user['first_name']
    user_invite.user_last_name = user['last_name']
    user_invite.user_email = user['email']
    user_invite.manager_name = manager['name']
    user_invite.manager_email = manager['email']
    user_invite.provider = manager['provider']
    user_invite.group_id = user['group_id']
    user_invite.group_name = user['group_name']
    user_invite.save
    user_invite
  end

  def accept_invite(cmr_client, urs_uid, access_token)
    if active
      unless group_id.empty?
        add_members_response = cmr_client.add_group_members(group_id, [urs_uid], access_token)
        added = add_members_response.success?
        unless added
          Rails.logger.error("Add Members to Group Error: #{add_members_response.clean_inspect}")
        end
      end

      self.active = false
      save

      GroupMailer.notify_manager(self, @added).deliver_now

      added
    end
  end

  def send_invite
    GroupMailer.invite_user(self).deliver_now
  end

  private

  def generate_token
    column = :token
    self[column] = loop do
      random_token = SecureRandom.urlsafe_base64(nil, false)
      break random_token unless self.class.exist?(column => random_token)
    end
  end
end
