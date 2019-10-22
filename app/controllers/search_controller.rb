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

    search_response =
      case @record_type
      when 'collections'
        query['include_granule_counts'] = true
        cmr_client.get_collections(query, token)
      when 'variables'
        cmr_client.get_variables(query, token)
      when 'services'
        cmr_client.get_services(query, token)
      else # no record type
        return [[], [], 0]
      end

    if search_response.success?
      records = search_response.body['items']
      errors = []
      hits = search_response.body['hits'].to_i
    else
      Rails.logger.error("Search Error: #{search_response.clean_inspect}")

      records = []
      hits = 0
      errors = search_response.error_messages(i18n: I18n.t("controllers.search.get_search_results.#{@record_type}.error"))
    end

    [records, errors, hits]
  end

  def proposal_mode_enabled?
    authorize_public_actions(user: current_user, token: token)
  end
end
