class ProposalMailer < ApplicationMailer
  def proposal_submitted_notification(user, short_name, version, id)
    @user = user
    @short_name = short_name
    @version = version
    @id = id

    email_subject = 'New Create Collection Proposal Submitted in Metadata Management Tool'

    mail(to: "#{@user[:name]} <#{@user[:email]}>", subject: email_subject)
  end

  def proposal_approved_notification(user, short_name, version, id)
    @user = user
    @short_name = short_name
    @version = version
    @id = id

    email_subject = 'Create Collection Proposal Approved in Metadata Management Tool'

    mail(to: "#{@user[:name]} <#{@user[:email]}>", subject: email_subject)
  end

  def proposal_rejected_notification(user, proposal)
    @user = user
    @short_name = proposal.draft['ShortName']
    @version = proposal.draft['Version']
    @id = proposal.id
    @rejected_reasons = proposal.approver_feedback['reasons'].join(', ')
    @rejected_note = proposal.approver_feedback['note']
    @request_type = proposal.request_type

    email_subject = "#{@request_type.titleize} Collection Proposal Rejected in Metadata Management Tool"

    mail(to: "#{@user[:name]} <#{@user[:email]}>", subject: email_subject)
  end
end
