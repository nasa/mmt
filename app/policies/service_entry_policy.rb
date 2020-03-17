# :nodoc:
class ServiceEntryPolicy < ApplicationPolicy
  def new?
    create?
  end

  def edit?
    update?
  end

  def create?
    @create.nil? ? fetch_granted_permissions(action: 'create', user: user.user, type: 'provider', target: 'EXTENDED_SERVICE', token: user.token) : @create
  end

  def update?
    @update.nil? ? fetch_granted_permissions(action: 'update', user: user.user, type: 'provider', target: 'EXTENDED_SERVICE', token: user.token) : @update
  end

  def destroy?
    @delete.nil? ? fetch_granted_permissions(action: 'delete', user: user.user, type: 'provider', target: 'EXTENDED_SERVICE', token: user.token) : @delete
  end
end
