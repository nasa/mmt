# :nodoc:
class ManageCmrController < ApplicationController
  include EchoSoap
  include ChooserEndpoints

  before_action :check_if_system_acl_administrator, only: :show
  before_action :check_if_current_provider_acl_administrator, only: :show
  before_action :groups_enabled?
  after_action :cleanup_request

  # These are json respones for ajax calls that user wouldnt get to without being logged in.
  skip_before_action :ensure_user_is_logged_in, only: [
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

  # URS users search for groups and subscriptions
  def urs_search
    render json: render_users_from_urs(
      search_urs(params[:search])
    )
  end

  def get_order_option_list(echo_provider_token, guids = nil)
    if (guids.nil? || guids.empty?)
      guids_response = echo_client.get_order_options_names(echo_provider_token)
      guids = guids_response.success? ? Array.wrap(guids_response.parsed_body(parser: 'libxml').fetch('Item', []).map { |option| option['Guid'] }) : []
    end
    order_options = []
    while guids.length > 0
      guids = Array.wrap(guids)
      guids_chunk = guids.pop(50)
      partial_order_option_response = echo_client.get_order_options(echo_provider_token, guids_chunk)
      if partial_order_option_response.success?
        partial_order_options = Array.wrap(partial_order_option_response.parsed_body(parser: 'libxml').fetch('Item', []))
        order_options.concat(partial_order_options)
      else
        Rails.logger.error("Retrieve Order Options Error: #{partial_order_option_response.clean_inspect}") if partial_order_option_response.error?
        return {'Item' => []}
      end
    end
    return {'Item' => order_options}
  end

  def get_service_option_list(echo_provider_token, guids = nil)
    if (guids.nil? || guids.empty?)
      guids_response = echo_client.get_service_options_names(echo_provider_token)
      guids = guids_response.success? ? Array.wrap(guids_response.parsed_body(parser: 'libxml').fetch('Item', []).map { |option| option['Guid'] }) : []
    end
    service_options = []
    while guids.length > 0
      guids = Array.wrap(guids)
      guids_chunk = guids.pop(50)
      partial_service_option_response = echo_client.get_service_options(echo_provider_token, guids_chunk)
      if partial_service_option_response.success?
        partial_service_options = Array.wrap(partial_service_option_response.parsed_body(parser: 'libxml').fetch('Item', []))
        service_options.concat(partial_service_options)
      else
        Rails.logger.error("Retrieve Service Options Error: #{partial_service_option_response.clean_inspect}") if partial_service_option_response.error?
        return {'Item' => []}
      end
    end
    return {'Item' => service_options}
  end

  private

  # Custom error messaging for Pundit
  def user_not_authorized(exception)
    policy_name = exception.policy.class.to_s.underscore

    flash[:error] = I18n.t("#{policy_name}.#{exception.query}", scope: 'pundit', default: :default)
    redirect_to(request.referrer || manage_cmr_path)
  end

  # Sets an array of actions that the current user has permission to take
  # on the provided policy_name. This passes through Pundit and exists for
  # displaying a list of objects on an index page in conjuction with actions_table_header
  # within the application_helper
  def set_allowed_actions(policy_name, actions)
    @allowed_actions = actions.select { |action| policy(policy_name).send("#{action}?") }
  end

  def check_if_system_acl_administrator
    @user_is_system_acl_admin =
      user_has_system_permission_to(user: current_user, action: %w[read create update delete], target: 'ANY_ACL', token: token)
  end

  def redirect_unless_system_acl_admin
    check_if_system_acl_administrator
    redirect_to manage_cmr_path unless @user_is_system_acl_admin
  end

  def check_if_current_provider_acl_administrator
    @user_is_current_provider_acl_admin =
      user_has_provider_permission_to(user: current_user, action: %w[read create update delete], target: 'PROVIDER_OBJECT_ACL', token: token)
  end

  def check_if_current_group_provider_acl_administrator(group_provider:)
    @user_is_current_group_provider_acl_admin =
      user_has_provider_permission_to(user: current_user, action: %w[read create update delete], target: 'PROVIDER_OBJECT_ACL', token: token, specific_provider: group_provider)
  end

  def redirect_unless_current_provider_acl_admin
    check_if_current_provider_acl_administrator
    check_if_system_acl_administrator
    redirect_to manage_cmr_path unless @user_is_current_provider_acl_admin || @user_is_system_acl_admin
  end

  #
  # The 3 helper methods below are used for tracking time spent issuing faraday requests for orders.
  # Used to setup an initial budget of time allowed to complete requests
  #
  # echo_client.timeout as of 5/16/19 is 300 seconds (nginx timeout value), subtracting 30 seconds for any
  # potential processing, the rest of the remaining time will be used for faraday requests.
  def init_time_tracking_variables
    @timeout_duration = Echo::Base::NGINX_TIMEOUT - 30
    @request_start = Time.new
  end

  # returns the time remaining for the request to complete for orders, used as a timeout value for faraday connections.
  def time_left
    @timeout_duration - (Time.new - @request_start)
  end

  # cleans up any echo clients created.
  def cleanup_request
    Rails.logger.info("Cleaning up #{request.uuid}")
    Rails.cache.delete("echo-client-#{request.uuid}")
  end
end
