class SearchController < ManageCollectionsController
  include SearchHelper

  RESULTS_PER_PAGE = 25

  def index
    page = params['page'].to_i || 1
    page = 1 if page < 1

    results_per_page = RESULTS_PER_PAGE

    # TODO: do we care about search_type anymore?? I think not...
    search_type = params.delete('search_type')

    # set query
    @query = {}
    @query['keyword'] = params['keyword'] || ''
    @query['provider_id'] = params['provider_id'] unless params['provider_id'].blank?
    # @query['record_state'] = params['record_state']
    @record_type = params['record_type']

    @query['sort_key'] = params['sort_key'] if params['sort_key']
    @query['page_num'] = page
    @query['page_size'] = results_per_page

    good_query_params = @query.clone
    records, @errors, hits = get_records(good_query_params)

    add_breadcrumb 'Search Results', search_path

    @records = Kaminari.paginate_array(records, total_count: hits).page(page).per(results_per_page)
  end

  private

  def get_records(query)
    errors = []

    query['keyword'] = query['keyword'].strip.gsub(/\s+/, '* ')
    query['keyword'] += '*' unless query['keyword'].last == '*'

    search_results =
      case @record_type
      when 'collections'
        cmr_client.get_collections_by_post(query, token).body
      when 'variables'
        cmr_client.get_variables(query, token).body
      end

    hits = search_results['hits'].to_i
    if search_results['errors']
      errors = search_results['errors']
      records = []
    elsif search_results['items']
      records = search_results['items']
    end

    [records, errors, hits]
  end

  def get_published(query)
  # def get_collections(query)
    errors = []

    unless query['keyword'].blank?
      query['keyword'] = query['keyword'].strip.gsub(/\s+/, '* ') + '*'
    end

    collections = cmr_client.get_collections_by_post(query, token).body

    hits = collections['hits'].to_i
    if collections['errors']
      errors = collections['errors']
      collections = []
    elsif collections['items']
      collections = collections['items']
    end

    [collections, errors, hits]
  end

  # def get_drafts(query)
  #   providers = Array.wrap(query['provider_id'] || current_user.available_providers)
  #   drafts = Draft.where('lower(short_name) LIKE ? OR lower(entry_title) LIKE ?',
  #                        "%#{query['keyword'].downcase}%", "%#{query['keyword'].downcase}%")
  #                 .where('provider_id IN (?)', providers)
  #
  #   if query['sort_key']
  #     if query['sort_key'].starts_with?('-')
  #       sort_key = query['sort_key'][1..-1].to_sym
  #       sort_order = :desc
  #     else
  #       sort_key = query['sort_key'].to_sym
  #       sort_order = :asc
  #     end
  #     sort_key = :updated_at if sort_key == :revision_date
  #     drafts = drafts.order(sort_key => sort_order)
  #   end
  #
  #   # Map drafts to same structure we get from CMR
  #   drafts = drafts.map do |draft|
  #     {
  #       'meta' => {
  #         'revision-date' => draft['updated_at'].to_s[0..9],
  #         'draft_id' => draft.id,
  #         'provider-id' => draft.provider_id
  #       },
  #       'umm' => {
  #         'short-name' => draft.display_short_name,
  #         'entry-title' => draft.display_entry_title,
  #         'version-id' => draft.draft['Version']
  #       }
  #     }
  #   end
  #
  #   [drafts, [], drafts.size]
  # end
end
