class DraftMailer < ApplicationMailer
  def draft_published_notification(user, concept_id, revision_id, short_name, version, existing_errors = nil, warnings = nil)
    @user = user
    @concept_id = concept_id
    @short_name = short_name
    @version = version

    @revision_id = revision_id.to_i
    @is_update = @revision_id > 1
    if @is_update
      email_subject = "Record Updated in Metadata Management Tool#{@email_env_note}"
      @existing_errors = existing_errors
      @warnings = warnings
    else
      email_subject = "New Record Published in Metadata Management Tool#{@email_env_note}"
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
      email_subject = "Variable Record Updated in Metadata Management Tool#{@email_env_note}"
    else
      email_subject = "New Variable Record Published in Metadata Management Tool#{@email_env_note}"
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
      email_subject = "Service Record Updated in Metadata Management Tool#{@email_env_note}"
    else
      email_subject = "New Service Record Published in Metadata Management Tool#{@email_env_note}"
    end

    mail(to: "#{@user[:name]} <#{@user[:email]}>", subject: email_subject)
  end

  def tool_draft_published_notification(user, concept_id, revision_id, short_name)
    @user = user
    @concept_id = concept_id
    @revision_id = revision_id.to_i
    @short_name = short_name

    is_update = @revision_id > 1
    @publish_or_update = is_update ? 'Updated' : 'Published'

    email_subject = "#{'New ' unless is_update}Tool Record #{@publish_or_update} in Metadata Management Tool#{@email_env_note}"

    message_preposition = is_update ? 'in' : 'to'
    @email_message = "Your tool metadata record #{short_name} has been successfully #{@publish_or_update.downcase} #{message_preposition} the CMR#{@email_env_note}. Your tool's concept ID is #{@concept_id}."

    mail(to: "#{@user[:name]} <#{@user[:email]}>", subject: email_subject)
  end
end
