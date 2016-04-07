# Preview all emails at http://localhost:3000/rails/mailers/group_mailer
class GroupMailerPreview < ActionMailer::Preview
  def invite_user
    invite = UserInvite.new(
      manager_name: 'Manager Name',
      manager_email: 'manager@example.com',
      user_first_name: 'First',
      user_last_name: 'Last',
      user_email: 'user@example.com',
      group_id: 'AG1200000423-MMT_1',
      group_name: 'Test Group',
      provider: 'MMT_1',
      token: 'mailer_token',
      active: true
    )
    GroupMailer.invite_user(invite)
  end

  def notify_manager
    invite = UserInvite.new(
      manager_name: 'Manager Name',
      manager_email: 'manager@example.com',
      user_first_name: 'First',
      user_last_name: 'Last',
      user_email: 'user@example.com',
      group_id: 'AG1200000423-MMT_1',
      group_name: 'Test Group',
      provider: 'MMT_1',
      token: 'mailer_token',
      active: false
    )
    GroupMailer.notify_manager(invite, true)
  end
end
