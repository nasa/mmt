# Preview all emails at http://localhost:3000/rails/mailers/group_mailer
class GroupMailerPreview < ActionMailer::Preview
  def invite_user
    GroupMailer.invite_user({ 'name' => 'NAME', 'email' => 'test@example.com' }, 'MANAGERNAME', nil)
  end

  def notify_manager
    GroupMailer.notify_manager({ 'email' => 'test@example.com' }, 'USER', 'GROUPNAME')
  end
end
