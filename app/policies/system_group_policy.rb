# :nodoc:
class SystemGroupPolicy < ApplicationPolicy
  def new?
    create?
  end

  def edit?
    update?
  end

  def create?
    # user_has_permission_to('create', 'GROUP')
    user_has_system_permission_to(user: user.user, action: 'create', target: 'GROUP', token: user.token)
  end

  def read?
    # user_has_permission_to('read', 'GROUP')
    user_has_system_permission_to(user: user.user, action: 'read', target: 'GROUP', token: user.token)
  end

  def show?
    read?
  end

  # CMR-2585 made it so a user can update or delete any system level group
  # if they have the Create permission on system level groups
  def update?
    create?
  end

  def destroy?
    create?
  end
end
