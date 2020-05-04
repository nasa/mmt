# :nodoc:
class SubscriptionPolicy < ApplicationPolicy
  def new?
    create?
  end

  def edit?
    update?
  end

  def create?
    @create.nil? ? fetch_granted_permissions(action: 'create', user: user.user, type: 'provider', target: 'EMAIL_SUBSCRIPTION_MANAGEMENT', token: user.token) : @create
    # TODO: use `caller_locations.first.label` when adding another acl check
  end

  def update?
    @update.nil? ? fetch_granted_permissions(action: 'update', user: user.user, type: 'provider', target: 'EMAIL_SUBSCRIPTION_MANAGEMENT', token: user.token) : @update
  end

  def index?
    show?
  end

  def show?
    @read.nil? ? fetch_granted_permissions(action: 'read', user: user.user, type: 'provider', target: 'EMAIL_SUBSCRIPTION_MANAGEMENT', token: user.token) : @read
  end

  def destroy?
    @delete.nil? ? fetch_granted_permissions(action: 'delete', user: user.user, type: 'provider', target: 'EMAIL_SUBSCRIPTION_MANAGEMENT', token: user.token) : @delete
  end

  def test_subscription?
    create?
  end
end
