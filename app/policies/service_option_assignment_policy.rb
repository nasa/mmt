# :nodoc:
class ServiceOptionAssignmentPolicy < ProviderPolicy
  def destroy?
    user_has_permission_to('delete', 'OPTION_ASSIGNMENT')
  end
end
