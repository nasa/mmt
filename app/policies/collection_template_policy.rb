class CollectionTemplatePolicy < CollectionDraftPolicy
  def create_draft?
    user.user.provider_id == target.provider_id
  end

  def new_from_existing?
    !user.user.provider_id.blank?
  end
end
