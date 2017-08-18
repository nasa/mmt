# :nodoc:
class SearchController < ManageMetadataController
  include SearchHelper

  RESULTS_PER_PAGE = 25

  def index
    page = params['page'].to_i || 1
    page = 1 if page < 1

    results_per_page = RESULTS_PER_PAGE

    @record_type = params['record_type']

    # set query
    @query = {}
    @query['keyword'] = params['keyword'] || ''
    @query['provider_id'] = params['provider_id'] unless params['provider_id'].blank?
    @query['sort_key'] = params['sort_key'] unless params['sort_key'].blank?
    @query['page_num'] = page
    @query['page_size'] = results_per_page

    good_query_params = @query.clone
    records, @errors, hits = get_search_results(good_query_params)

    add_breadcrumb 'Search Results', search_path

    @records = Kaminari.paginate_array(records, total_count: hits).page(page).per(results_per_page)
  end

  private

  def get_search_results(query)
    errors = []

    query['keyword'] = query['keyword'].strip.gsub(/\s+/, '* ')
    query['keyword'] += '*' unless query['keyword'].last == '*'

    search_results =
      case @record_type
      when 'collections'
        cmr_client.get_collections_by_post(query, token).body
      when 'variables'
        cmr_client.get_variables(query, token).body
      else # no record type
        return [[], [], 0]
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
end
