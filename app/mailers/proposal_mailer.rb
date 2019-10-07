class ProposalMailer < ApplicationMailer
  def proposal_submitted_notification(user, short_name, version, id)
    @user = user
    @short_name = short_name
    @version = version
    @id = id

    email_subject = 'New Create Collection Proposal Submitted in Metadata Management Tool'

    mail(to: "#{@user[:name]} <#{@user[:email]}>", subject: email_subject)
  end
end
