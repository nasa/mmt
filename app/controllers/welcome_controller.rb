class WelcomeController < ApplicationController
  include ProviderHoldings

  skip_before_action :ensure_user_is_logged_in, :setup_query, :provider_set?
  skip_before_action :refresh_launchpad_if_needed
  skip_before_action :refresh_urs_if_needed
  skip_before_action :proposal_mode_enabled?
  skip_before_action :proposal_approver_permissions

  before_action :redirect_if_logged_in

  # Skip all filters for status
  # Todo this is causing MMT not to work in Rails 5
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

  protected

  def redirect_if_logged_in
    return redirect_to internal_landing_page if logged_in? && server_session_expires_in > 0
  end
end
