class WelcomeController < ApplicationController
  skip_before_filter :is_logged_in, :setup_query

  def index
    redirect_to dashboard_path if logged_in?

    providers = Hash[cmr_client.get_provider_summaries.body.map{|p| [p['provider-id'], {'provider_id'=>p['provider-id'], 'short_name' => p['short-name']}]}]

    holdings = cmr_client.get_provider_holdings.body

    providers.each do |id, values|
      holding = holdings.select{|h| h['provider-id'] == id}
      values['collection_count'] = holding.size
      values['granule_count'] = holding.map{|h| h['granule-count']}.inject(:+)
    end

    providers = providers.delete_if {|id, value| value['collection_count'] == 0 }

    if (providers.empty?)
      @table_rows = nil
      @total_hit_count = 0
    else
      @table_rows = providers.values.sort {|x, y| x['short_name']<=>y['short_name']}
      @total_hit_count = @table_rows.size
    end

  end
end
