class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  #test comment by Shae
  protect_from_forgery with: :exception

  protected

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
end
