# :nodoc:
class ProviderPolicy < ApplicationPolicy
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

  def provider_permissions_for_target(target)
    # set options
    check_permission_options = {
      # URS ID of the user
      user_id: @user.user.urs_uid,

      # Current provider (e.g. MMT_2)
      provider: @user.user.provider_id,

      # The resource to get this users permissions on (e.g. OPTION_DEFINITION)
      target: target
    }

    @user_permission_response ||= cmr_client.check_user_permissions(check_permission_options, @user.token)

    if @user_permission_response.success?
      # TODO: This should already be JSON -- Update once CMR-3783 is complete
      permission_body = JSON.parse(@user_permission_response.body)

      # Return the permission, default to an empty array
      permission_body[target] || []
    else
      Rails.logger.error("Error retrieving #{target} permission for #{@user.user.urs_uid}: #{@user_permission_response.inspect}")

      # Default response (no permissions)
      []
    end
  end

  def user_has_permission_to(action, target)
    granted_permissions = provider_permissions_for_target(target)

    Rails.logger.debug("#{@user.user.urs_uid} has #{granted_permissions} permissions on #{target}.")

    return false if granted_permissions.empty?

    needed_permissions = Array.wrap(action)
    
    needed_permissions.all? { |perm| granted_permissions.include?(perm) }
  end

  def cmr_client
    @cmr_client ||= Cmr::Client.client_for_environment(Rails.configuration.cmr_env, Rails.configuration.services)
  end
end
