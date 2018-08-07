class CollectionTemplatesController < TemplatesController
  def create_draft
    authorize get_resource
    draft = CollectionDraft.create_from_template(get_resource, current_user)
    Rails.logger.info("Audit Log: Collection Draft #{draft.entry_title} was created by #{current_user.urs_uid} in provider: #{current_user.provider_id}")
    redirect_to collection_draft_path(draft)
  end
end
