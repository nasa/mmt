class ManageCmrController < PagesController
  before_filter :set_notifications, only: :manage_cmr
  before_filter :check_if_system_acl_administrator, only: :manage_cmr

  def manage_cmr
  end

  private

  def check_if_system_acl_administrator
    check_permission_options = { user_id: current_user.urs_uid, system_object: 'ANY_ACL' }
    user_permission_response = cmr_client.check_user_permissions(check_permission_options, token)
    if user_permission_response.success?
      permission = JSON.parse(user_permission_response.body) # why is this JSON but other CMR responses don't need to be parsed?
      granted_permissions = permission.fetch('ANY_ACL', [])
      if !granted_permissions.blank? && granted_permissions.all? { |perm| !perm.blank? && %w(read create update delete).include?(perm) }
        @user_is_system_acl_admin = true
      end
    else
      Rails.logger.error("Check User Permission Response for #{current_user.urs_uid}: #{user_permission_response.inspect}")
      check_permission_error = Array.wrap(user_permission_response.body['errors'])[0]
      flash[:error] = check_permission_error
    end
  end
end
