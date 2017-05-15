# :nodoc:
class ManageCmrController < PagesController
  include EchoSoap
  include ChooserEndpoints

  before_filter :check_if_system_acl_administrator, only: :show
  before_filter :check_if_current_provider_acl_administrator, only: :show
  before_filter :groups_enabled?

  # These are json respones for ajax calls that user wouldnt get to without being logged in.
  skip_before_filter :is_logged_in, only: [
    :provider_collections,
    :service_implementations_with_datasets,
    :datasets_for_service_implementation
  ]

  layout 'manage_cmr'

  def show; end

  # JSON representation of the get_provider_collections method for use with the Chooser
  def provider_collections(options = {})
    collections = get_provider_collections(params.merge(options).permit(:provider, :keyword, :page_size, :page_num, :short_name, concept_id: []))

    render_collections_for_chooser(collections)
  rescue
    collections
  end

  # JSON representation of the get_service_implementations_with_datasets method for use with the Chooser
  def service_implementations_with_datasets
    service_entries = get_service_implementations_with_datasets(params.permit(:name))

    render json: {
      'hits': service_entries.count,
      'items': service_entries.map do |entry|
        [entry['Guid'], entry['Name']]
      end
    }
  rescue
    render json: service_entries
  end

  # JSON representation of the get_service_implementations_with_datasets method for use with the Chooser
  def datasets_for_service_implementation
    collections = get_datasets_for_service_implementation(params.permit(:service_interface_guid, :page_size, :page_num, :short_name))

    render_collections_for_chooser(collections)
  end

  private

  # Sets an array of actions that the current user has permission to take
  # on the provided policy_name. This passes through Pundit and exists for
  # displaying a list of objects on an index page in conjuction with actions_table_header
  # within the application_helper
  def set_allowed_actions(policy_name, actions)
    @allowed_actions = actions.select { |action| policy(policy_name).send("#{action}?") }
  end

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
