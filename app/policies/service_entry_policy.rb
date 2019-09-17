# :nodoc:
class ServiceEntryPolicy < ApplicationPolicy
  def new?
    create?
  end

  def edit?
    update?
  end

  def create?
    user_has_provider_permission_to(user: user.user, action: 'create', target: 'EXTENDED_SERVICE', token: user.token)
  end

  def update?
    user_has_provider_permission_to(user: user.user, action: 'update', target: 'EXTENDED_SERVICE', token: user.token)
  end

  def destroy?
    user_has_provider_permission_to(user: user.user, action: 'delete', target: 'EXTENDED_SERVICE', token: user.token)
  end
end
