class CollectionTemplatePolicy < CollectionDraftPolicy
  def create_draft?
    user.user.provider_id == target.provider_id
  end

  # Same as draft new/create; ensure user has an id set.
  def new_from_existing?
    !user.user.provider_id.blank?
  end

  def publish?
    false
  end
end
