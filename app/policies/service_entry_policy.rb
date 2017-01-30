# :nodoc:
class ServiceEntryPolicy < ProviderPolicy
  def new?
    create?
  end

  def create?
    user_has_permission_to('create', 'EXTENDED_SERVICE')
  end

end
