# :nodoc:
class ApplicationController < ActionController::Base
  include Pundit

  # Prevent CSRF attacks by raising an exception.
  protect_from_forgery with: :exception

  before_action :is_logged_in
  before_action :setup_query
  before_action :refresh_urs_if_needed, except: [:logout, :refresh_token] # URS login
  before_action :provider_set?

  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  protected

  # Seconds ahead of the token expiration that the server should
  # attempt to refresh the token
  SERVER_EXPIRATION_OFFSET_S = 60
  # For testing, token expires after 10 seconds
  # SERVER_EXPIRATION_OFFSET_S = 3590

  def urs_login_required?
    ENV['urs_login_required'] == 'true'
  end
  helper_method :urs_login_required?

  # By default Pundit calls the current_user method during authorization
  # but for our calls to the CMR ACL we need user information as well as
  # the users valid token. This provides our policies with the ability to
  # retrieve the authenticated user but also to their token
  def pundit_user
    UserContext.new(current_user, token)
  end

  def cmr_client
    @cmr_client ||= Cmr::Client.client_for_environment(Rails.configuration.cmr_env, Rails.configuration.services)
  end
  helper_method :cmr_client

  def echo_client
    @echo_client ||= Echo::Client.client_for_environment(Rails.configuration.echo_env, Rails.configuration.services)
  end
  helper_method :echo_client

  def setup_query
    @query ||= {}
    providers_response = cmr_client.get_providers
    @provider_ids ||= if providers_response.success?
                        providers_response.body.map { |provider| [provider['short-name'], provider['provider-id']] }.sort
                      else
                        Rails.logger.error("Error retrieving providers in `setup_query`: #{providers_response.inspect}")
                        []
                      end
  end

  def current_user
    @current_user ||= User.from_urs_uid(authenticated_urs_uid)
  end
  helper_method :current_user

  def current_provider?(provider)
    current_user.provider_id == provider
  end
  helper_method :current_provider?

  def available_provider?(provider)
    (current_user.available_providers || []).include?(provider)
  end
  helper_method :available_provider?

  def provider_set?
    if logged_in? && current_user.provider_id.nil?
      redirect_to provider_context_path
    end
  end

  def store_profile(profile = {})
    # URS login

    # TODO remove this comment with Launchpad feature toggle ticket
    # this method should be able to be used for both urs and launchpad login as we should
    # be receiving the same user information from URS (but from different calls)
    uid = session['endpoint'].split('/').last if session['endpoint']

    session[:name] = profile['first_name'].nil? ? uid : "#{profile['first_name']} #{profile['last_name']}"
    session[:urs_uid] = profile['uid'] || uid
    session[:email_address] = profile['email_address']

    return if profile == {}

    # Store ECHO ID
    if current_user.echo_id.nil?
      response = cmr_client.get_current_user(token)
      if response.success?
        echo_user = response.body

        current_user.update(echo_id: echo_user.fetch('user', {}).fetch('id'))
      end
    end

    # With no echo_id we cannot request providers for the user, no sense in continuing
    return if current_user.echo_id.nil?
  end

  def store_oauth_token(json = {})
    # URS login
    session[:access_token] = json['access_token']
    session[:refresh_token] = json['refresh_token']
    session[:expires_in] = json['expires_in']
    session[:logged_in_at] = json.empty? ? nil : Time.now.to_i
    session[:endpoint] = json['endpoint']
  end

  def logged_in?
    if urs_login_required?
      is_user_logged_in = session[:access_token].present? &&
                          session[:refresh_token].present? &&
                          session[:expires_in].present? &&
                          session[:logged_in_at].present?

      store_oauth_token unless is_user_logged_in # clear session time and token values if user is not logged in
      is_user_logged_in
    end

  end

  def is_logged_in
    if !urs_login_required? # && !launchpad_login_required?
      # TODO this should only happen if URS login AND Launchpad login are both turned off (which should not happen)
      Rails.logger.error('An error has occured. Both URS and Launchpad feature toggle environment variables seem to have been turned off. Please check urs_login_required and launchpad_login_required')

      redirect_to root_url, flash: { error: "An error has occurred with our login system. Please contact #{view_context.mail_to('support@earthdata.nasa.gov', 'Earthdata Support')}." }
    end

    if urs_login_required?
      Rails.logger.info("Access Token: #{token}") if Rails.env.development?
      session[:return_to] = request.fullpath

      return true if logged_in?
      redirect_to login_path
    end
  end
  helper_method :is_logged_in

  def logged_in_at
    session[:logged_in_at].nil? ? 0 : session[:logged_in_at]
  end

  def expires_in
    (logged_in_at + session[:expires_in]) - Time.now.to_i
  end

  def server_session_expires_in
    logged_in? ? (expires_in - SERVER_EXPIRATION_OFFSET_S).to_i : 0
  end

  def refresh_urs_if_needed
    # URS login
    if urs_login_required?
      refresh_urs_token if logged_in? && server_session_expires_in < 0
    end
  end

  def refresh_urs_token
    # URS login
    response = cmr_client.refresh_token(session[:refresh_token])
    return nil unless response.success?

    json = response.body
    store_oauth_token(json)

    if json.nil? && !request.xhr?
      session[:last_point] = request.fullpath

      redirect_to cmr_client.urs_login_path
    end

    json
  end

  def token
    if urs_login_required?
      session[:access_token]
    end
  end
  helper_method :token

  def token_with_client_id
    if Rails.env.development? && params[:controller] == 'collections' && params[:action] == 'show'
      # in development, only for download_xml links, we need to use the tokens created on local cmr setup
      'ABC-2'
    else
      services = Rails.configuration.services
      config = services['earthdata'][Rails.configuration.cmr_env]
      client_id = services['urs'][Rails.env.to_s][config['urs_root']]

      "#{token}:#{client_id}"
    end
  end
  helper_method :token_with_client_id

  def echo_provider_token
    set_provider_context_token if session[:echo_provider_token].nil?

    session[:echo_provider_token]
  end
  helper_method :echo_provider_token

  def redirect_after_login
    return_to = session[:return_to]
    session[:return_to] = nil

    last_point = session[:last_point]
    session[:last_point] = nil

    redirect_to return_to || last_point || manage_collections_path
  end

  private

  def groups_enabled?
    redirect_to manage_collections_path unless Rails.configuration.groups_enabled
  end

  def bulk_updates_enabled?
    redirect_to manage_collections_path unless Rails.configuration.bulk_updates_enabled
  end

  def umm_s_enabled?
    redirect_to manage_collections_path unless Rails.configuration.umm_s_enabled
  end

  def authenticated_urs_uid
    session[:urs_uid]
  end

  def get_user_info
    user = {}
    user[:name] = session[:name]
    user[:email] = session[:email_address]
    user
  end

  def set_provider_context_token
    session[:echo_provider_token] = echo_client.get_provider_context_token(token_with_client_id, behalfOfProvider: current_user.provider_id).parsed_body
  end

  # Custom error messaging for Pundit
  def user_not_authorized(exception)
    policy_name = exception.policy.class.to_s.underscore

    flash[:error] = t("#{policy_name}.#{exception.query}", scope: 'pundit', default: :default)
    redirect_to(request.referrer || manage_collections_path)
  end
end
