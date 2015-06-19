class SearchController < ApplicationController

  RESULTS_PER_PAGE = 25

  def search1
    entry_id_target = params[:entry_id_target] || ''
    @page = (params[:page] || '1').to_i
    @sort = params[:sort] || 'entry_title'
    @results_per_page = RESULTS_PER_PAGE

    client = Cmr::Client.client_for_environment(Rails.configuration.cmr_env, Rails.configuration.services)

    @query_results = client.get_collections({"entry_id" => entry_id_target, 'page_num' => @page, 'page_size' => @results_per_page, 'sort_key' => @sort})

    if (@query_results.nil? || @query_results.body.nil? || @query_results.body["feed"].nil? || @query_results.body["feed"]["entry"].nil?)
      @table_rows = nil
      @total_hit_count = 0
    else
      @table_rows = @query_results.body["feed"]["entry"]
      @total_hit_count = @query_results.headers['cmr-hits'].to_i
    end

  end #----------------------------------------------------------------------

  def fetch_collection_search_results
    entry_id_target = params[:entry_id_target] || ''
    @page = (params[:page] || '1').to_i
    @sort = params[:sort] || 'entry_title'
    @results_per_page = RESULTS_PER_PAGE

    client = Cmr::Client.client_for_environment(Rails.configuration.cmr_env, Rails.configuration.services)

    @query_results = client.get_collections({"entry_id" => entry_id_target, 'page_num' => @page, 'page_size' => @results_per_page, 'sort_key' => @sort})

    if (@query_results.nil? || @query_results.body.nil? || @query_results.body["feed"].nil? || @query_results.body["feed"]["entry"].nil?)
      @table_rows = nil
      @total_hit_count = 0
    else
      @table_rows = @query_results.body["feed"]["entry"]
      @total_hit_count = @query_results.headers['cmr-hits'].to_i
    end

    respond_to do |format|
      format.js
    end

  end #----------------------------------------------------------------------

end
