# :nodoc:
class TemplatePolicy < ApplicationPolicy
  def create_draft?
    user.user.provider_id == target.provider_id
  end

  def destroy?
    user.user.provider_id == target.provider_id
  end

  # Same as draft new/create; ensure user has an id set.
  def new_from_existing?
    !user.user.provider_id.blank?
  end

  # :nodoc
  class Scope < Scope
    def resolve
      scope.where(provider_id: user.user.provider_id)
    end
  end
end
