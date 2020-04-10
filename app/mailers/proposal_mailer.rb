class ProposalMailer < ApplicationMailer
  def proposal_submitted_notification(user, short_name, version, id, request_type)
    @user = user
    @short_name = short_name
    @version = version
    @id = id

    email_subject = "New #{request_type.titleize} Collection Request Submitted in Metadata Management Tool"

    email_subject = email_subject + env_if_needed

    mail(to: "#{@user[:name]} <#{@user[:email]}>", subject: email_subject)
  end

  def proposal_approved_notification(user, short_name, version, id, request_type)
    @user = user
    @short_name = short_name
    @version = version
    @id = id

    email_subject = "#{request_type.titleize} Collection Request Approved in Metadata Management Tool"

    email_subject = email_subject + env_if_needed

    mail(to: "#{@user[:name]} <#{@user[:email]}>", subject: email_subject)
  end

  def proposal_published_notification(user, cmr_response_body, proposal)
    @user = user
    @concept_id = cmr_response_body['concept-id']
    @short_name = proposal['draft']['ShortName']
    @version = proposal['draft']['Version']
    @revision_id = cmr_response_body['revision-id'].to_i
    @request_type = proposal['request_type']

    email_subject = "#{@request_type.titleize} Collection Request Published in Metadata Management Tool"

    email_subject = email_subject + env_if_needed

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

    email_subject = email_subject + env_if_needed

    mail(to: "#{@user[:name]} <#{@user[:email]}>", subject: email_subject)
  end

  def proposal_submitted_approvers_notification(approver, proposal, user)
    @approver = approver
    @user = user
    @short_name = proposal.draft['ShortName']
    @version = proposal.draft['Version']
    @id = proposal.id
    @request_type = proposal.request_type

    email_subject = "New #{@request_type.titleize} Collection Proposal Submitted in Metadata Management Tool"

    email_subject = email_subject + env_if_needed

    mail(to: "#{@approver[:name]} <#{@approver[:email]}>", subject: email_subject)
  end
end
