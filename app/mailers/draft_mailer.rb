class DraftMailer < ApplicationMailer
  def draft_published_notification(user, concept_id, revision_id)
    @user = user
    @concept_id = concept_id

    @revision_id = revision_id.to_i
    @is_update = @revision_id > 1
    if @is_update
      email_subject = 'Record Updated in Metadata Management Tool'
    else
      email_subject = 'New Record Published in Metadata Management Tool'
    end

    mail(to: "#{@user[:name]} <#{@user[:email]}>", subject: email_subject) do |format|
      format.html
      format.text
    end
  end
end
