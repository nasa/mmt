# :nodoc:
class ServiceOptionAssignmentPolicy < ApplicationPolicy
  def new?
    create?
  end

  def create?
    user_has_provider_permission_to(user: user.user, action: 'create', target: 'OPTION_ASSIGNMENT', token: user.token)
  end

  def destroy?
    user_has_provider_permission_to(user: user.user, action: 'delete', target: 'OPTION_ASSIGNMENT', token: user.token)
  end
end
