class SearchController < ApplicationController
  include SearchHelper

  RESULTS_PER_PAGE = 25
  DEFAULT_SORT_ORDER = 'entry_title'

  def index
    page = params[:page].to_i || 1
    page = 1 if page < 1
    sort = params[:sort] || DEFAULT_SORT_ORDER

    @results_per_page = RESULTS_PER_PAGE

    # Did the search come from quick_find or full_search
    if params['search_type'] == 'quick_find'
      # If search came from quick find, only use the quick find input
      params.delete('search_type')
      params.delete('search_term_type')
      params.delete('search_term')
      @query = {}
      unless params['entry_id'].blank?
        @query['entry_id'] = @query['search_term'] = params['entry_id']
        @query['search_term_type'] = 'entry_id'
      end
      @query['record_state'] = 'published_records'
    elsif params['search_type'] == 'full_search'
      # If search came from full search, ignore whatever was in quick find
      params.delete('search_type')
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

    good_query_params = prune_query(@query.clone)

    @errors = []
    @collections = []
    case @query['record_state']
    when 'published_records'
        @collections = get_published(good_query_params)
      when 'draft_records'
        @collections = get_drafts(good_query_params)
      when 'published_and_draft_records'
        @collections = get_published_and_drafts(good_query_params)
    end

  end


  private

  def get_published(query)
    # TODO Fix paging
    query['page_size'] = 25
    query['page_num'] = 1

    query['all_revisions'] = true

    query.delete('record_state')
    published_collections = cmr_client.get_collections(query, token).body
    if published_collections['errors']
      @errors = published_collections['errors']
      published_collections = []
    end
    if published_collections['items']
      published_collections = published_collections['items']
    end
    published_collections
  end

  def get_drafts(query)
    query.delete('record_state')

    draft_collections = Draft.where(query.permit!)

    # Map drafts to same structure we get from CMR
    draft_collections.map do |draft|
      {
        'meta' => { 'revision-date' => draft['updated_at'].to_s[0..9] },
        'umm' => {
          'entry-id' => draft.display_entry_id,
          'entry-title' => draft.display_entry_title
        }
      }
    end
  end

  def get_published_and_drafts(query)
    published_collections = get_published(query.clone)
    draft_collections = get_drafts(query)

    collections = (published_collections.concat(draft_collections)).sort {|x, y|
      x['umm']['entry-title']<=>y['umm']['entry-title']
    }
  end
end
