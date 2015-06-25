class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_filter :is_logged_in

  protected

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

  def clear_session
    store_oauth_token()
    session[:user_id] = nil
    session[:recent_datasets] = []
  end

  def store_oauth_token(json={})
    json ||= {}
    session[:access_token] = json["access_token"]
    session[:refresh_token] = json["refresh_token"]
    session[:expires_in] = json["expires_in"]
    session[:logged_in_at] = json.empty? ? nil : Time.now.to_i
  end

  def store_profile(profile={})
    session[:name] = "#{profile['first_name']} #{profile['last_name']}"
    session[:urs_uid] = profile['uid']
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
end
