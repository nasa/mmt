# :nodoc:
class SubscriptionPolicy < ApplicationPolicy
  def new?
    create?
  end

  def edit?
    update?
  end

  def create?
    user_has_provider_permission_to(user: user.user, action: 'create', target: 'EMAIL_SUBSCRIPTION_MANAGEMENT', token: user.token)
    # TODO: use `caller_locations.first.label` when adding another acl check
  end

  def update?
    user_has_provider_permission_to(user: user.user, action: 'update', target: 'EMAIL_SUBSCRIPTION_MANAGEMENT', token: user.token)
  end

  def index?
    user_has_provider_permission_to(user: user.user, action: 'read', target: 'EMAIL_SUBSCRIPTION_MANAGEMENT', token: user.token)
  end

  def destroy?
    user_has_provider_permission_to(user: user.user, action: 'delete', target: 'EMAIL_SUBSCRIPTION_MANAGEMENT', token: user.token)
  end
end
