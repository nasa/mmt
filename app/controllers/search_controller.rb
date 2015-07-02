class SearchController < ApplicationController
  include SearchHelper

  RESULTS_PER_PAGE = 25
  DEFAULT_SORT_ORDER = 'entry_title'

  def index
    page = params[:page].to_i || 1
    page = 1 if page < 1
    sort = params[:sort] || DEFAULT_SORT_ORDER

    @results_per_page = RESULTS_PER_PAGE

    # Pages are not currently supported in CMR
    # @query = {'page_num' => @page, 'page_size' => @results_per_page, 'sort_key' => @sort}
    @query = params.clone
    @query['latest'] = true
    @query['page'] = 1
    @query.delete('entry-id') if @query['entry-id'].blank?
    @query.delete('provider-id') if @query['provider-id'].blank?

    # populate search term from quick find entry-id searches
    if @query['entry-id'].present?
      @query['search-term-type'] = 'entry-id'
      @query['search-term'] = @query['entry-id']
    end

    # Handle search term field with selector
    case params['search-term-type']
    when 'entry-id'
      @query['entry-id'] = params['search-term']
    when 'entry-title'
      @query['entry-title'] = params['search-term']
    end

    good_params = prune_query(@query.clone)
    query_results = cmr_client.get_collections(good_params)

    if (query_results.nil? || query_results.body.nil?)
      @table_rows = nil
      @total_hit_count = 0
    else
      @table_rows = query_results.body
      @total_hit_count = query_results.body.size
    end

  end

end
