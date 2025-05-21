module ManageCmr
  # :nodoc:
  class ProviderHoldingsController < ManageCmrController
    include ProviderHoldings

    add_breadcrumb 'Provider Holdings', :provider_holdings_path

    def index
      if current_user.available_providers.size == 1
        return redirect_to provider_holding_path(current_user.provider_id)
      end

      set_data_providers(token)
    end

    def show
      set_provider_holdings(params[:id], token)

      add_breadcrumb "#{@provider['provider_id']} Holdings", provider_holdings_path(@provider['provider_id'])
    end
  end
end
