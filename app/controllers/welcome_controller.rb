class WelcomeController < ApplicationController
  include SearchHelper

  skip_before_filter :is_logged_in, :setup_query

  RESULTS_PER_PAGE = 25
  DEFAULT_SORT_ORDER = 'provider_name'

  def index
    redirect_to dashboard_path if logged_in?

    page = params[:page].to_i || 1
    page = 1 if page < 1
    sort = params[:sort] || DEFAULT_SORT_ORDER

    @results_per_page = RESULTS_PER_PAGE

    @query = params.clone
    @query['page'] = 1

    query_results = cmr_client.get_provider_holdings()

    # Create hash holding keyed on provider_id holding provider name, total collections and total granules
    holdings_hash = Hash.new
    query_results.body.each do |q|
      provider_id = q['provider-id']
      if holdings_hash[provider_id].nil?
        holdings_hash[provider_id] = {'id'=>q['provider-id'], 'name'=>q['provider-id'], 'granule-count'=>q['granule-count'].to_i, 'collection-count'=>1}
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
