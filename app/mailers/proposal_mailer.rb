class ProposalMailer < ApplicationMailer
  def proposal_submitted_notification(user, short_name, version, id, request_type)
    @user = user
    @short_name = short_name
    @version = version
    @id = id

    email_subject = "New #{request_type.titleize} Collection Request Submitted in Metadata Management Tool"

    mail(to: "#{@user[:name]} <#{@user[:email]}>", subject: email_subject)
  end

  def proposal_approved_notification(user, short_name, version, id, request_type)
    @user = user
    @short_name = short_name
    @version = version
    @id = id

    email_subject = "#{request_type.titleize} Collection Request Approved in Metadata Management Tool"

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

    mail(to: "#{@user[:name]} <#{@user[:email]}>", subject: email_subject)
  end
end
