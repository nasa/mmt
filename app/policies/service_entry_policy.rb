# :nodoc:
class ServiceEntryPolicy < ApplicationPolicy
  def new?
    create?
  end

  def edit?
    update?
  end

  def create?
    @create.nil? ? fetch_granted_permissions(action: 'create') : @create
  end

  def update?
    @update.nil? ? fetch_granted_permissions(action: 'update') : @update
  end

  def destroy?
    @delete.nil? ? fetch_granted_permissions(action: 'delete') : @delete
  end

  # We may need to check these acls many times on a page.  This lets us only hit
  # cmr once per page.
  def fetch_granted_permissions(action:)
    permissions = granted_permissions_for_user(user: user.user, type: 'provider', target: 'EXTENDED_SERVICE', token: user.token)
    @create = permissions.include?('create')
    @update = permissions.include?('update')
    @delete = permissions.include?('delete')
    instance_variable_get("@#{action}")
  end
end
