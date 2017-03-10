# :nodoc:
class SystemPolicy < ApplicationPolicy
  def index?
    true
  end

  def show?
    true
  end

  def new?
    create?
  end

  def edit?
    update?
  end

  def create?
    false
  end

  def update?
    false
  end

  def destroy?
    false
  end

  def system_permissions_for_target(target)
    # set options
    check_permission_options = {
      # URS ID of the user
      user_id: @user.user.urs_uid,

      # The resource to get this users permissions on (e.g. ANY_ACL)
      system_object: target
    }

    @user_permission_response ||= cmr_client.check_user_permissions(check_permission_options, @user.token)

    if @user_permission_response.success?
      # TODO: This should already be JSON -- Update once CMR-3783 is complete
      permission_body = JSON.parse(@user_permission_response.body)

      # Return the permission, default to an empty array
      permission_body[target] || []
    else
      Rails.logger.error("Error retrieving System #{target} permission for #{@user.user.urs_uid}: #{@user_permission_response.inspect}")

      # Default response (no permissions)
      []
    end
  end

  def user_has_permission_to(action, target)
    granted_permissions = system_permissions_for_target(target)

    Rails.logger.debug("#{@user.user.urs_uid} has #{granted_permissions} permissions on System #{target}.")

    return false if granted_permissions.empty?

    needed_permissions = Array.wrap(action)

    needed_permissions.all? { |perm| granted_permissions.include?(perm) }
  end
end
