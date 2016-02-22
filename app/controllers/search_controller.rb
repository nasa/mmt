class SearchController < ApplicationController
  include SearchHelper

  RESULTS_PER_PAGE = 25

  def index
    page = params['page'].to_i || 1
    page = 1 if page < 1

    results_per_page = RESULTS_PER_PAGE

    search_type = params.delete('search_type')

    # Did the search come from quick_find or full_search
    if search_type == 'quick_find'
      # If search came from quick find, only use the quick find input
      params.delete('full_search_term')

      @query = {}
      # use cmr keyword search for quick_find
      @query['keyword'] = @query['search_term'] = params['quick_find_keyword'] ? params['quick_find_keyword'] : params['search_term']
      @query['record_state'] = 'published_records'
      @query['sort_key'] = params['sort_key'] if params['sort_key']
    elsif search_type == 'full_search'
      # If search came from full search, ignore whatever was in quick find
      params.delete('quick_find_keyword')

      @query = params.clone

      @query['search_term'] = params['full_search_term'] ? params['full_search_term'] : params['search_term']
      if @query['record_state'] == 'published_records'
        # if published collection, use cmr keyword search
        @query['keyword'] = @query['search_term']
      elsif @query['record_state'] == 'draft_records'
        @query['drafts_search_term'] = @query['search_term']
      end

      @query.delete('provider_id') if @query['provider_id'].blank?
    end

    @query['page_num'] = page
    @query.delete('page')
    @query['page_size'] = results_per_page

    good_query_params = prune_query(@query.clone)
    @query['search_type'] = search_type

    collections, @errors, hits = get_search_results(good_query_params)

    @collections = Kaminari.paginate_array(collections, total_count: hits).page(page).per(results_per_page)
  end

  private

  def get_search_results(query)
    record_state = query.delete('record_state')

    collections, errors, hits =
      case record_state
      when 'published_records'
        get_published(query)
      when 'draft_records'
        get_drafts(query)
      else
        [[], [], 0]
      end

    [collections, errors, hits]
  end

  def get_published(query)
    errors = []

    collections = cmr_client.get_collections(query, token).body
    hits = collections['hits'].to_i
    if collections['errors']
      errors = collections['errors']
      collections = []
    end

    collections = collections['items'] if collections['items']

    [collections, errors, hits]
  end

  def get_drafts(query)
    query.delete('page_num')
    query.delete('page_size')

    # original query command
    # drafts = Draft.where(query.permit!) # TODO Modify the query to use offset and RESULTS_PER_PAGE to support pagination

    drafts = Draft.where('lower(short_name) LIKE ? OR lower(entry_title) LIKE ?',
                         "%#{query['drafts_search_term'].downcase}%", "%#{query['drafts_search_term'].downcase}%")
                  .where('provider_id IN (?)', @current_user.available_providers)
    drafts = drafts.where(provider_id: query['provider_id']) if query['provider_id']
    if query['sort_key']
      if query['sort_key'].starts_with?('-')
        sort_key = query['sort_key'][1..-1].to_sym
        sort_order = :desc
      else
        sort_key = query['sort_key'].to_sym
        sort_order = :asc
      end
      drafts = drafts.order(sort_key => sort_order)
    end

    # Map drafts to same structure we get from CMR
    drafts = drafts.map do |draft|
      {
        'meta' => {
          'revision-date' => draft['updated_at'].to_s[0..9],
          'draft_id' => draft.id,
          'provider-id' => draft.provider_id
        },
        'umm' => {
          'short-name' => draft.display_short_name,
          'entry-title' => draft.display_entry_title,
          'version-id' => draft.draft['Version']
        }
      }
    end

    [drafts, [], drafts.size]
  end
end
