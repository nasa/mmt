# :nodoc:
class DraftPolicy < ApplicationPolicy
  def show?
    user.provider_id == target.provider_id
    # user.available_providers.include?(target.provider_id)
  end

  def new?
    create?
  end

  def edit?
    update?
  end

  def create?
    # make sure user has a provider id set
    !user.provider_id.blank?
  end

  def update?
    user.provider_id == target.provider_id
  end

  def destroy?
    user.provider_id == target.provider_id
  end

  # :nodoc
  class Scope < Scope
    def resolve
      scope.where(provider_id: user.provider_id)
    end
  end
end
