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
      params.delete('search_term_type')
      params.delete('search_term')
      @query = {}
      unless params['entry_id'].blank?
        @query['entry_id'] = @query['search_term'] = params['entry_id']
        @query['search_term_type'] = 'entry_id'
      end
      @query['record_state'] = 'published_records'
      @query['sort_key'] = params['sort_key'] if params['sort_key']
    elsif search_type == 'full_search'
      # If search came from full search, ignore whatever was in quick find
      params.delete('entry_id')
      @query = params.clone
      @query.delete('provider_id') if @query['provider_id'].blank?

      # Handle search term field with selector
      # if no search term exists, reset the type
      params.delete('search_term_type') if params['search_term'].empty?
      case params['search_term_type']
      when 'entry_id'
        @query['entry_id'] = params['search_term']
      when 'entry_title'
        @query['entry_title'] = params['search_term']
      when 'concept_id'
        @query['concept_id'] = params['search_term']
      end
    end

    @query['page_num'] = page
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
      when 'published_and_draft_records'
        get_published_and_drafts(query)
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
    query.delete('_')

    drafts = Draft.where(query.permit!) # TODO Modify the query to use offset and RESULTS_PER_PAGE to support pagination

    # Map drafts to same structure we get from CMR
    drafts = drafts.map do |draft|
      {
        'meta' => {
          'revision-date' => draft['updated_at'].to_s[0..9],
          'draft_id' => draft.id
        },
        'umm' => {
          'entry-id' => draft.display_entry_id,
          'entry-title' => draft.display_entry_title
        }
      }
    end

    [drafts, [], drafts.size]
  end

  def get_published_and_drafts(query)
    published_collections, published_errors, published_hits = get_published(query.clone)
    drafts, _draft_errors, draft_hits = get_drafts(query)

    collections = published_collections.concat(drafts).sort do |x, y|
      x['umm']['entry-title'] <=> y['umm']['entry-title']
    end

    [collections, published_errors, published_hits + draft_hits]
  end
end
