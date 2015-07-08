class WelcomeController < ApplicationController
  skip_before_filter :is_logged_in, :setup_query

  def index
    redirect_to dashboard_path if logged_in?

    # Create a hash w/ provider-id as the key and provider-name as the value so we can easily lookup provider-names later
    provider_query = cmr_client.get_provider_summaries
    provider_hash = Hash.new
    provider_query.body.each do |p|
      provider_hash[p['provider-id']] = p['short-name']
    end

    query_results = cmr_client.get_provider_holdings

    # Create hash w/ provider-id as the key, holding a hash of provider name, total collections and total granules
    holdings_hash = Hash.new
    query_results.body.each do |q|
      provider_id = q['provider-id']
      if holdings_hash[provider_id].nil?
        provider_name = provider_hash[provider_id]
        holdings_hash[provider_id] = {'id'=>provider_id, 'name'=>provider_name, 'granule-count'=>q['granule-count'].to_i, 'collection-count'=>1}
      else
        holdings_hash[provider_id]['collection-count'] += 1
        holdings_hash[provider_id]['granule-count'] += q['granule-count'].to_i
      end
    end

    if (holdings_hash.empty?)
      @table_rows = nil
      @total_hit_count = 0
    else
      @table_rows = holdings_hash.values.sort {|x, y| x['name']<=>y['name']}
      @total_hit_count = @table_rows.size
    end

  end
end
