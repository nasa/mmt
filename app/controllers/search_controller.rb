class SearchController < ApplicationController

  RESULTS_PER_PAGE = 25
  DEFAULT_SORT_ORDER = 'entry_title'

  def index
    @entry_id = params[:entry_id] || ''
    @page = params[:page] || '1'
    @page = '1' if @page.to_i < 1
    @sort = params[:sort] || DEFAULT_SORT_ORDER

    @results_per_page = RESULTS_PER_PAGE

    query_params = {'page_num' => @page, 'page_size' => @results_per_page, 'sort_key' => @sort}
    query_params["entry_id"] = @entry_id  if !@entry_id.blank?

    query_results = cmr_client.get_collections(query_params)

    if (query_results.nil? || query_results.body.nil? || query_results.body["feed"].nil? || query_results.body["feed"]["entry"].nil?)
      @table_rows = nil
      @total_hit_count = 0
    else
      @table_rows = query_results.body["feed"]["entry"]
      @total_hit_count = query_results.headers['cmr-hits'].to_i
    end

  end 

end
