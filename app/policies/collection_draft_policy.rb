# :nodoc:
class CollectionDraftPolicy < DraftPolicy
  def publish?
    user.user.provider_id == target.provider_id
  end

  def check_cmr_validation?
    user.user.provider_id == target.provider_id
  end
end
