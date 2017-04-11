class WelcomeController < ApplicationController
  include ProviderHoldings

  skip_before_filter :is_logged_in, :setup_query

  before_filter :redirect_if_logged_in

  # Skip all filters for status
  skip_filter *_process_action_callbacks.map(&:filter), only: [:status]

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
    return redirect_to manage_metadata_path if logged_in?
  end
end
