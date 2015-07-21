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
      @query['record-state'] = 'published-records'
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

    good_params = Search.prune_query(@query.clone)

    @errors = []
    @collections = []
    case @query['record-state']
      when 'published-records'
        @collections = get_published(good_params)
      when 'draft-records'
        @collections = get_drafts(good_params)
      when 'published-and-draft-records'
        @collections = get_published_and_drafts(good_params)
    end
    
  end


  private

  def get_published(params)
    # Note that published_collections is an array if successful and a hash if there are errors.
    params.delete('record-state')
    published_collections = cmr_client.get_collections(params).body
    if published_collections.is_a?(Hash) && published_collections['errors']
      @errors = published_collections['errors']
      published_collections = []
    end
    return published_collections
  end

  def get_drafts(params)
    # Temporary mapping of (ECHO) params to the UMM-C field names currently supported by drafts
    draft_params = {}
    draft_params['title'] = params['entry-title'] if !params['entry-title'].blank?
    draft_params['id'] = params['entry-id'] if !params['entry-id'].blank?
    params = draft_params

    draft_collections = Draft.where(params)  #.first #(for testing)
    # Note that draft_collections returns as either an array, an object or nil

    # Temporary changes to drafts to allow them to be handled in the same manner as crm records.
    temp = []
    if draft_collections.respond_to?('each')
      draft_collections.each do |d|
        temp << {'revision-date'=>d['updated_at'].to_s[0..9], 'extra-fields' => {'entry-title'=>d['title']|| 'ABC (Draft)', 'entry-id'=>d['id']}}
      end
    elsif !draft_collections.nil?
      temp << {'revision-date'=>draft_collections['updated_at'].to_s[0..9], 'extra-fields' => {'entry-title'=>draft_collections['title']|| 'ABC (Draft)', 'entry-id'=>draft_collections['id']}}
    end
    return temp
  end

  def get_published_and_drafts(params)
    published_collections = get_published(params)
    draft_collections = get_drafts(params)

    collections = (published_collections.concat(draft_collections)).sort {|x, y|
      x['extra-fields']['entry-title']<=>y['extra-fields']['entry-title']
    }
  end


end
