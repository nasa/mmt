# :nodoc:
class CollectionDraftPolicy < DraftPolicy
  def publish?
    user.provider_id == target.provider_id
  end
end
