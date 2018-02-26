class DraftMailer < ApplicationMailer
  def draft_published_notification(user, concept_id, revision_id, short_name, version)
    @user = user
    @concept_id = concept_id
    @short_name = short_name
    @version = version

    @revision_id = revision_id.to_i
    @is_update = @revision_id > 1
    if @is_update
      email_subject = 'Record Updated in Metadata Management Tool'
    else
      email_subject = 'New Record Published in Metadata Management Tool'
    end

    mail(to: "#{@user[:name]} <#{@user[:email]}>", subject: email_subject)
  end

  def variable_draft_published_notification(user, concept_id, revision_id, short_name)
    @user = user
    @concept_id = concept_id
    @short_name = short_name

    @revision_id = revision_id.to_i
    @is_update = @revision_id > 1
    if @is_update
      email_subject = 'Variable Record Updated in Metadata Management Tool'
    else
      email_subject = 'New Variable Record Published in Metadata Management Tool'
    end

    mail(to: "#{@user[:name]} <#{@user[:email]}>", subject: email_subject)
  end

  def service_draft_published_notification(user, concept_id, revision_id, short_name)
    @user = user
    @concept_id = concept_id
    @short_name = short_name

    @revision_id = revision_id.to_i
    @is_update = @revision_id > 1
    if @is_update
      email_subject = 'Service Record Updated in Metadata Management Tool'
    else
      email_subject = 'New Service Record Published in Metadata Management Tool'
    end

    mail(to: "#{@user[:name]} <#{@user[:email]}>", subject: email_subject)
  end
end
