# :nodoc:
class ApplicationPolicy
  include PermissionChecking

  attr_reader :user, :target

  def initialize(user, target)
    @user = user
    @target = target
  end

  def index?
    false
  end

  def show?
    false
  end

  def create?
    false
  end

  def new?
    create?
  end

  def update?
    false
  end

  def edit?
    update?
  end

  def destroy?
    false
  end

  # :nodoc:
  class Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user  = user
      @scope = scope
    end

    def resolve
      scope.all
    end
  end

  private

  def cmr_client
    @cmr_client ||= Cmr::Client.client_for_environment(Rails.configuration.cmr_env, Rails.configuration.services)
  end

  # replicate the helper methods we have for controllers and views, using the Pundit user context
  def current_user
    user.user
  end

  def token
    user.token
  end

  # We may need to check these acls many times on a page.  This lets us only hit
  # cmr once per page.
  def fetch_granted_permissions(action:, user:, type:, target:, token:)
    permissions = granted_permissions_for_user(user: user, type: type, target: target, token: token)
    @read = permissions.include?('read')
    @create = permissions.include?('create')
    @update = permissions.include?('update')
    @delete = permissions.include?('delete')
    instance_variable_get("@#{action}")
  end
end
