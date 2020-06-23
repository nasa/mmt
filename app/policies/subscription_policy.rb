# :nodoc:
class SubscriptionPolicy < ApplicationPolicy

  # There are only two rights allocated in CMR: Read and Update.
  #   If you can update than you can make other changes such as delete.
  #   If you can read you can show
  #
  # Users will need both INGEST_MANAGEMENT_ACL and SUBSCRIPTION_MANAGEMENT.
  #   The subscription managment feature is controlled by the Subscription ACL
  #   Ingest ACL is needed to submit the actual subscription data.

  def new?
    create?
  end

  def edit?
    update?
  end

  def create?
    # TODO: use `caller_locations.first.label` when adding another acl check
    update?
  end

  def update?
    @update.nil? ? fetch_granted_permissions(action: 'update', user: user.user, type: 'provider', target: 'SUBSCRIPTION_MANAGEMENT', token: user.token) : @update
  end

  def index?
    show? || update?
  end

  def show?
    @read.nil? ? fetch_granted_permissions(action: 'read', user: user.user, type: 'provider', target: 'SUBSCRIPTION_MANAGEMENT', token: user.token) : @read
  end

  def destroy?
    update?
  end

  def estimate_notifications?
    create? || update?
  end
end
