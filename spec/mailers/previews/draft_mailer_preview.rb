# Preview emails at http://localhost:3000/rails/mailers/draft_mailer
class DraftMailerPreview < ActionMailer::Preview
  def new_draft_published_notification
    user = {}
    user[:name] = "Captain Planet"
    user[:email] = "supergreen@bluemarble.com"

    concept_id = 'C1200000007-SEDAC'
    revision_id = 1

    DraftMailer.draft_published_notification(user, concept_id, revision_id)
  end

  def record_updated_notification
    user = {}
    user[:name] = "Captain Planet"
    user[:email] = "supergreen@bluemarble.com"

    concept_id = 'C1200000059-LARC'
    revision_id = 3

    DraftMailer.draft_published_notification(user, concept_id, revision_id)
  end
end
