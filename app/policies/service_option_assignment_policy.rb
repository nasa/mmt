# :nodoc:
class ServiceOptionAssignmentPolicy < ProviderPolicy
  def new?
    create?
  end

  def create?
    user_has_permission_to('create', 'OPTION_ASSIGNMENT')
  end

  def destroy?
    user_has_permission_to('delete', 'OPTION_ASSIGNMENT')
  end
end
