class ProviderHoldingsController < ApplicationController
  def index
    if @current_user.available_providers.size == 1
      return redirect_to provider_holding_path(@current_user.provider_id)
    end

    providers = Hash[cmr_client.get_providers.body.map { |p| [p['provider-id'], { 'provider_id' => p['provider-id'], 'short_name' => p['short-name'] }] }]
    providers.select! { |provider| @current_user.available_providers.include?(provider) }

    holdings = cmr_client.get_provider_holdings(false, nil, token).body

    providers.each do |id, values|
      holding = holdings.select { |h| h['provider-id'] == id }
      values['collection_count'] = holding.size
      values['granule_count'] = holding.map { |h| h['granule-count'] }.inject(:+) || 0
    end

    @providers = providers.values.sort { |x, y| x['short_name'] <=> y['short_name'] }
  end

  def show
    @provider_id = params[:id]

    collections = cmr_client.get_provider_holdings(false, @provider_id, token).body
    collections.map! { |q| { id: q['concept-id'], title: q['entry-title'], granules: q['granule-count'] } }
    collections.sort! { |x, y| x['entry-title'] <=> y['entry-title'] }

    @collections = collections
  end
end
