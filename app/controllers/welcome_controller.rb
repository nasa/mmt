class WelcomeController < ApplicationController
  include ProviderHoldings

  skip_before_action :ensure_user_is_logged_in, :setup_query

  before_action :redirect_if_logged_in

  # Skip all filters for status
  skip_filter *_process_action_callbacks.map(&:filter), only: [:status]

  # MMT-867: Removing Provider Holdings from the 'homepage' for now as we need because it's
  # causing issues with load times but before we can solve that we need to discuss the implemntation
  # requirements going forward.

  def index
    # set_data_providers
  end

  # def collections
  #   set_provider_holdings(params[:provider_id])

  #   add_breadcrumb "#{@provider['provider_id']} Holdings", provider_holding_path(@provider['provider_id'])
  # end

  # Small, light weight check if the app is running
  def status
    #if launchpad_login_required?
    launchpad_healthy =  cmr_client.launchpad_healthcheck.body == 'OK'.freeze
    Rails.logger.info "#{cmr_client.launchpad_healthcheck}"
    #ActiveRecord::Base.remove_connection
    begin
      db_healthy = ActiveRecord::Migrator.current_version != 0 if defined?(ActiveRecord)
    rescue StandardError => e
      Rails.logger.info "Database error: #{e}"
      db_healthy = false
    end
    #Rails.logger.info "launchpad healthcheck response #{{database: db_healthy, launchpad: launchpad_healthy}}"
    # If launchpad is disabled then we will not report a 500 error if launchpad still fails
    if (!launchpad_login_required? || launchpad_healthy) && db_healthy
      render json: {database: db_healthy, launchpad: launchpad_healthy}
    else
      render json: {database: db_healthy, launchpad: launchpad_healthy}, status: :service_unavailable
    end
    #ActiveRecord::Base.establish_connection
  end

  protected

  def redirect_if_logged_in
    return redirect_to manage_collections_path if logged_in?
  end
end
