class GroupMailer < ApplicationMailer::Preview
  def invite_user(user, from, group)
    @user = user
    @from = from
    @group = group
    mail(to: @user['email'], suject: 'Metadata Management Tool Invitation')
  end

  def notify_manager(manager, user, group)

  end
end
