class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_filter :is_logged_in, :setup_query, :setup_current_user
  before_filter :refresh_urs_if_needed, except: [:logout, :refresh_token]

  protected

  def setup_query
    @query ||= {}
    # we don't want to do this on every page, it takes forever
    @provider_ids = cmr_client.get_providers
  end

  def setup_current_user
    @current_user = User.from_urs_uid(session[:urs_uid])
  end

  def redirect_from_urs
    last_point = session[:last_point]
    session[:last_point] = nil
    last_point || root_url
  end

  def cmr_client
    if @cmr_client.nil?
      service_configs = Rails.configuration.services
      @cmr_client = Cmr::Client.client_for_environment(cmr_env, Rails.configuration.services)
    end
    @cmr_client
  end

  def cmr_env
    @cmr_env = Rails.configuration.cmr_env
  end
  helper_method :cmr_env

  def edsc_map_path
    service_configs = Rails.configuration.services
    edsc_root = service_configs['earthdata'][cmr_env]['edsc_root']
    "#{edsc_root}/search/map"
  end
  helper_method :edsc_map_path

  def clear_session
    store_oauth_token()
  end

  def store_oauth_token(json={})
    session[:access_token] = json["access_token"]
    session[:refresh_token] = json["refresh_token"]
    session[:expires_in] = json["expires_in"]
    session[:logged_in_at] = json.empty? ? nil : Time.now.to_i
  end

  def store_profile(profile={})
    session[:name] = "#{profile['first_name']} #{profile['last_name']}"
    session[:urs_uid] = profile['uid']
    @current_user = User.from_urs_uid(profile['uid'])
  end

  def refresh_urs_if_needed
    if logged_in? && server_session_expires_in < 0
      refresh_urs_token
    end
  end

  def refresh_urs_token
    json = cmr_client.refresh_token(session[:refresh_token]).body
    store_oauth_token(json)

    if json.nil? && !request.xhr?
      session[:last_point] = request.fullpath

      redirect_to cmr_client.urs_login_path
    end

    json
  end

  def token
    session[:access_token]
  end

  def logged_in?
    logged_in = session[:access_token].present? &&
          session[:refresh_token].present? &&
          session[:expires_in].present? &&
          session[:logged_in_at]

    store_oauth_token() unless logged_in
    logged_in
  end
  helper_method :logged_in?

  def is_logged_in
    redirect_to root_url unless logged_in?
  end

  def logged_in_at
    session[:logged_in_at].nil? ? 0 : session[:logged_in_at]
  end

  def expires_in
    (logged_in_at + session[:expires_in]) - Time.now.to_i
  end

  # Seconds ahead of the token expiration that the server should
  # attempt to refresh the token
  SERVER_EXPIRATION_OFFSET_S = 60
  # For testing, token expires after 10 seconds
  # SERVER_EXPIRATION_OFFSET_S = 3590

  def server_session_expires_in
    logged_in? ? (expires_in - SERVER_EXPIRATION_OFFSET_S).to_i : 0
  end
end
