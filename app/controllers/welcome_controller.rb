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
    render text: true
  end

  protected

  def redirect_if_logged_in
    return redirect_to manage_collections_path if logged_in?
  end
end
