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

  def proposal_published_notification(user, concept_id, revision_id, short_name, version, request_type)
    @user = user
    @concept_id = concept_id
    @short_name = short_name
    @version = version
    @revision_id = revision_id.to_i
    @request_type = request_type

    email_subject = "#{request_type.titleize} Collection Request Published in Metadata Management Tool"

    mail(to: "#{@user[:name]} <#{@user[:email]}>", subject: email_subject)
  end
end
