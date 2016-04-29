class GroupMailer < ApplicationMailer
  def invite_user(invite)
    @invite = invite
    mail(to: "#{@invite.user_first_name} #{@invite.user_last_name} <#{@invite.user_email}>",
         subject: 'Metadata Management Tool Invitation')
  end

  def notify_manager(invite, added)
    @invite = invite
    @added = added
    mail(to: "#{@invite.manager_name} <#{@invite.manager_email}>",
         subject: 'Metadata Management Tool Invitation Accepted')
  end
end
