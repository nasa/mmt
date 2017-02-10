class ManageCmrController < PagesController
  include EchoSoap

  before_filter :set_notifications, only: :show
  before_filter :check_if_system_acl_administrator, only: :show
  before_filter :check_if_current_provider_acl_administrator, only: :show

  layout 'manage_cmr'

  def show; end

  # Controller action tied to a route for retrieving provider collections
  def provider_collections
    render json: get_provider_collections(params.permit(:provider, :keyword, :page_size, :page_num, :short_name, concept_id: []))
  end
  
  # Controller method that allows developers to get this data without
  # making an HTTP request (with the exception of the CMR call)
  def get_provider_collections(params = {})
    collection_params = {
      'provider' => current_user.provider_id,
      'page_size' => 25
    }.merge(params)

    if collection_params.key?('short_name')
      collection_params['short_name'].concat('*')

      # In order to search with the wildcard parameter we need to tell CMR to use it
      collection_params['options'] = {
        'short_name' => {
          'pattern' => true
        }
      }
    end

    # Adds wildcard searching
    collection_params['keyword'].concat('*') if collection_params.key?('keyword')

    # Retreive the collections from CMR, allowing a few additional parameters
    response = cmr_client.get_collections(collection_params, token)

    if response.success?
      # The chooser expects an array of arrays, so that's what we'll give it
      collections = response.body.fetch('items', []).map do |collection|
        [
          collection.fetch('meta', {}).fetch('concept-id'),
          [
            collection.fetch('umm', {}).fetch('short-name'),
            collection.fetch('umm', {}).fetch('entry-title')
          ].join(' | ')
        ]
      end

      {
        'hits': response.body.fetch('hits', 0),
        'items': collections
      }
    else
      response.body
    end
  end

  def service_implementations_with_datasets
    render json: get_service_implementations_with_datasets(params.permit(:name))
  end

  def get_service_implementations_with_datasets(params = {})
    # Retrieve all service entries for the current provider
    response = echo_client.get_service_entries_by_provider(echo_provider_token, current_provider_guid)

    if response.success?
      service_entries = Array.wrap(response.parsed_body.fetch('Item', [])).sort_by { |option| option['Name'].downcase }

      # Allow filtering the results by name (This is really slow and now recommended, but is a necessary feature)
      unless params.fetch('name', nil).blank?
        service_entries.select! { |s| s['Name'].downcase.start_with?(params['name'].downcase) }
      end

      # Filter down our list of all service entries that belong to the current provider to
      # just those with EntryType of SERVICE_IMPLEMENTATION and that have collections assigned to them
      service_entries.select! do |s|
        s['EntryType'] == 'SERVICE_IMPLEMENTATION' &&
          (s['TagGuids'] || {}).fetch('Item', []).any? { |t| t.split('_', 3).include?('DATASET') }
      end

      {
        'hits': service_entries.count,
        'items': service_entries.map do |entry|
          [entry['Guid'], entry['Name']]
        end
      }
    else
      response.body
    end
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
