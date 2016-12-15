class ManageCmrController < PagesController
  before_filter :set_notifications, only: :manage_cmr
  before_filter :check_if_system_acl_administrator, only: :manage_cmr
  before_filter :check_if_current_provider_acl_administrator, only: :manage_cmr

  def manage_cmr
  end

  private
  def check_if_administrator_of(type, target)
    # set default permission (similar to cmr response if no permissions)
    permission = { target => [] }

    # set options
    check_permission_options = { user_id: current_user.urs_uid }
    if type == 'system'
      check_permission_options[:system_object] = target
    elsif type == 'provider'
      check_permission_options[:provider] = current_user.provider_id
      check_permission_options[:target] = target
    end

    user_permission_response = cmr_client.check_user_permissions(check_permission_options, token)

    if user_permission_response.success?
      permission = JSON.parse(user_permission_response.body) # why is this JSON but other CMR responses don't need to be parsed?
    else
      log_target = target
      log_target = "#{current_user.provider_id} #{target}" if type == 'provider'
      Rails.logger.error("Check User Permission for #{log_target} Response Error for #{current_user.urs_uid}: #{user_permission_response.inspect}")
      check_permission_error = Array.wrap(user_permission_response.body['errors'])[0]
      flash[:error] = check_permission_error
    end

    permission
  end

  def check_if_system_group_administrator
    permission = check_if_administrator_of('system', 'GROUP')

    granted_permissions = permission.fetch('GROUP', [])
    needed_permissions = %w(read create)
    if !granted_permissions.blank? && needed_permissions.all? { |perm| granted_permissions.include?(perm) }
      @user_is_system_group_admin = true
    end
  end

  def check_if_system_acl_administrator
    permission = check_if_administrator_of('system', 'ANY_ACL')

    granted_permissions = permission.fetch('ANY_ACL', [])
    needed_permissions = %w(read create update delete)
    if !granted_permissions.blank? && needed_permissions.all? { |perm| granted_permissions.include?(perm) }
      @user_is_system_acl_admin = true
    end
  end

  def redirect_unless_system_acl_admin
    check_if_system_acl_administrator
    redirect_to manage_cmr_path unless @user_is_system_acl_admin
  end

  def check_if_current_provider_acl_administrator
    permission = check_if_administrator_of('provider', 'PROVIDER_OBJECT_ACL')

    granted_permissions = permission.fetch('PROVIDER_OBJECT_ACL', [])
    needed_permissions = %w(create read update delete)
    if !granted_permissions.blank? && needed_permissions.all? { |perm| granted_permissions.include?(perm) }
      @user_is_current_provider_acl_admin = true
    end
  end

  def redirect_unless_current_provider_acl_admin
    check_if_current_provider_acl_administrator
    check_if_system_acl_administrator
    redirect_to manage_cmr_path unless @user_is_current_provider_acl_admin || @user_is_system_acl_admin
  end
end
