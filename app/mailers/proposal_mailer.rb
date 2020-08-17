class ProposalMailer < ApplicationMailer
  DMMT_USER_GUIDE_URL = "https://wiki.earthdata.nasa.gov/display/ED/Draft+MMT+%28dMMT%29+User%27s+Guide"

  def proposal_submitted_notification(user, short_name, version, id, request_type)
    @user = user
    @short_name = short_name
    @version = version
    @id = id

    email_subject = "New #{request_type.titleize} Collection Request Submitted in Metadata Management Tool#{@email_env_note}"

    mail(to: "#{@user[:name]} <#{@user[:email]}>", subject: email_subject)
  end

  def proposal_approved_notification(user, short_name, version, id, request_type)
    @user = user
    @short_name = short_name
    @version = version
    @id = id

    email_subject = "#{request_type.titleize} Collection Request Approved in Metadata Management Tool#{@email_env_note}"

    mail(to: "#{@user[:name]} <#{@user[:email]}>", subject: email_subject)
  end

  def proposal_published_notification(user, cmr_response_body, proposal)
    @user = user
    @concept_id = cmr_response_body['concept-id']
    @short_name = proposal['draft']['ShortName']
    @version = proposal['draft']['Version']
    @revision_id = cmr_response_body['revision-id'].to_i
    @request_type = proposal['request_type']

    @request_specific_message = case @request_type
                                  when 'delete'
                                      'deleted from'
                                  when 'update'
                                      'updated in'
                                  when 'create'
                                      'published to'
                                  end

    email_subject = "#{@request_type.titleize} Collection Request Published in Metadata Management Tool#{@email_env_note}"

    mail(to: "#{@user[:name]} <#{@user[:email]}>", subject: email_subject)
  end

  def proposal_rejected_notification(user:, proposal:, approver:)
    @user = user
    @short_name = proposal.draft['ShortName']
    @version = proposal.draft['Version']
    @id = proposal.id
    rejected_reasons = proposal.approver_feedback['reasons']&.join(', ')
    @reasons_text = " for the following reasons: '#{rejected_reasons}'" if rejected_reasons
    @dmmt_user_guide_url = DMMT_USER_GUIDE_URL unless approver
    @rejected_note = proposal.approver_feedback['note']
    @request_type = proposal.request_type

    email_subject = "#{@request_type.titleize} Collection Proposal Rejected in Metadata Management Tool#{@email_env_note}"

    mail(to: "#{@user[:name]} <#{@user[:email]}>", subject: email_subject)
  end

  def proposal_submitted_approvers_notification(approver, proposal, user)
    @approver = approver
    @user = user
    @short_name = proposal.draft['ShortName']
    @version = proposal.draft['Version']
    @id = proposal.id
    @request_type = proposal.request_type

    email_subject = "New #{@request_type.titleize} Collection Proposal Submitted in Metadata Management Tool#{@email_env_note}"

    mail(to: "#{@approver[:name]} <#{@approver[:email]}>", subject: email_subject)
  end
end
