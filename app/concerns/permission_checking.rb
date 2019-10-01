# frozen_string_literal: true

# These methods are used for checking Permissions (aka ACLs) to determine if
# a user has access to System or Provider Identity Permissions
# these will be used by the controllers as well as Pundit
module PermissionChecking
  extend ActiveSupport::Concern

  def is_non_nasa_draft_user?(user:, token:)
    # TODO: when we work MMT-1920 to update configurations, these environment
    # configurations may need to be changed

    # the required ACL for CRUD for Collection Draft Proposals is the Non-NASA Draft MMT User
    # we are only checking for the `create` permission for all CRUD access
    if Rails.env.production?
      # in Production, this ACL will be provided in the SCIOPS provider
      # we are on
      user_has_provider_permission_to(user: user, action: 'create', target: 'NON_NASA_DRAFT_USER', token: token, specific_provider: 'SCIOPS')
    elsif Rails.env.sit? || Rails.env.uat?
      # SIT and UAT, this ACL will be provided in SCIOPS as well as SCIOPSTEST for testing
      user_has_provider_permission_to(user: user, action: 'create', target: 'NON_NASA_DRAFT_USER', token: token, specific_provider: 'SCIOPS') || user_has_provider_permission_to(user: user, action: 'create', target: 'NON_NASA_DRAFT_USER', token: token, specific_provider: 'SCIOPSTEST')
    elsif Rails.env.development? || Rails.env.test?
      # in development and test, we will use MMT_2 as we do for most tests
      user_has_provider_permission_to(user: user, action: 'create', target: 'NON_NASA_DRAFT_USER', token: token, specific_provider: 'MMT_2')
    end
  end

  def user_has_provider_permission_to(user:, action:, target:, token:, specific_provider: nil)
    user_has_permission_to(user: user, action: action, target: target, type: 'provider', token: token, specific_provider: specific_provider)
  end

  def user_has_system_permission_to(user:, action:, target:, token:)
    user_has_permission_to(user: user, action: action, target: target, type: 'system', token: token)
  end

  def user_has_permission_to(user:, action:, target:, type:, token:, specific_provider: nil)
    granted_permissions = permissions_for_target(user: user, target: target, type: type, token: token, specific_provider: specific_provider)

    log_target = "#{type.capitalize} #{target}"
    log_target += " for #{specific_provider || user.provider_id}" if type == 'provider'

    Rails.logger.debug "#{user.urs_uid} has #{granted_permissions} permissions on #{log_target}"

    return false if granted_permissions.empty?

    needed_permissions = Array.wrap(action)

    needed_permissions.all? { |perm| granted_permissions.include?(perm) }
  end

  def permissions_for_target(user:, target:, type:, token:, specific_provider: nil)
    # set options
    check_permission_options = {
      user_id: user.urs_uid
    }

    case type
    when 'system'
      # system resource to get the user's permissions on (i.e. ANY_ACL)
      check_permission_options['system_object'] = target
    when 'provider'
      # provider and resource to get the user's permissions on (i.e. MMT_2, OPTION_DEFINITION)
      check_permission_options['provider'] = specific_provider || user.provider_id
      check_permission_options['target'] = target
    end

    user_permission_response ||= cmr_client.check_user_permissions(check_permission_options, token)

    if user_permission_response.success?
      # need to use JSON.parse here because this response comes back as a json string,
      # which is different from all other responses from this service
      permission_body = JSON.parse(user_permission_response.body)

      # Return the permission, default to an empty array
      permission_body[target] || []
    else
      log_target = "#{type.capitalize} #{target} permission for"
      log_target += " #{user.provider_id} for" if type == 'provider'

      Rails.logger.error("Error retrieving #{log_target} #{user.urs_uid}: #{user_permission_response.clean_inspect}")

      # Default response (no permissions)
      []
    end
  end
end
