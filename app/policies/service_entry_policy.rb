# :nodoc:
class ServiceEntryPolicy < ProviderPolicy
  def new?
    create?
  end

  def edit?
    update?
  end

  def create?
    user_has_permission_to('create', 'EXTENDED_SERVICE')
  end

  def update?
    user_has_permission_to('update', 'EXTENDED_SERVICE')
  end
end
