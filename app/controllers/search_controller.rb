class SearchController < ApplicationController

  RESULTS_PER_PAGE = 25
  DEFAULT_SORT_ORDER = 'entry_title'

  def search1
    @entry_id_target = params[:entry_id_target] || ''
    @page = params[:page] || '1'
    @sort = params[:sort] || DEFAULT_SORT_ORDER

    @results_per_page = RESULTS_PER_PAGE

    @table_rows, @total_hit_count = Search.query_collections(@entry_id_target, @page, @sort, @results_per_page)

  end #----------------------------------------------------------------------

  def fetch_collection_search_results
    @entry_id_target = params[:entry_id_target] || ''
    @page = params[:page] || '1'
    @sort = params[:sort] || DEFAULT_SORT_ORDER

    @results_per_page = RESULTS_PER_PAGE

    @table_rows, @total_hit_count = Search.query_collections(@entry_id_target, @page, @sort, @results_per_page)

    respond_to do |format|
      format.js
    end

  end #----------------------------------------------------------------------

end
