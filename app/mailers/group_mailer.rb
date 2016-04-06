class GroupMailer < ApplicationMailer
  def invite_user(invite)
    @invite = invite
    mail(to: @invite.user_email, subject: 'Metadata Management Tool Invitation')
  end

  def notify_manager(manager, user, group)
    @manager = manager
    @user = user
    @group = group
    mail(to: @manager['email'], subject: 'Metadata Management Tool Invitation Accepted')
  end
end
