class SearchController < ApplicationController
  include SearchHelper

  RESULTS_PER_PAGE = 25
  DEFAULT_SORT_ORDER = 'entry_title'

  def index
    page = params[:page].to_i || 1
    page = 1 if page < 1
    sort = params[:sort] || DEFAULT_SORT_ORDER

    @results_per_page = RESULTS_PER_PAGE

    # Did the search come from quick-find or full-search
    if params['quick-find'] #&& params['entry-id'].present?
      # If search came from quick find, only use the quick find input
      params.delete('quick-find')
      params.delete('search-term-type')
      params.delete('search-term')
      @query = {}
      unless params['entry-id'].blank?
        @query['entry-id'] = @query['search-term'] = params['entry-id']
        @query['search-term-type'] = 'entry-id'
      end
    elsif params['full-search']
      # If search came from full search, ignore whatever was in quick find
      params.delete('full-search')
      params.delete('entry-id')
      @query = params.clone
      @query.delete('provider-id') if @query['provider-id'].blank?

      # Handle search term field with selector
      # if no search term exists, reset the type
      params.delete('search-term-type') if params['search-term'].empty?
      case params['search-term-type']
      when 'entry-id'
        @query['entry-id'] = params['search-term']
      when 'entry-title'
        @query['entry-title'] = params['search-term']
      when 'concept-id'
        @query['concept-id'] = params['search-term']
      end
    end

    # Pages are not currently supported in CMR
    # @query = {'page_num' => @page, 'page_size' => @results_per_page, 'sort_key' => @sort}
    @query['latest'] = true
    @query['page'] = 1

    good_params = prune_query(@query.clone)
    @collections = cmr_client.get_collections(good_params).body

  end

end
