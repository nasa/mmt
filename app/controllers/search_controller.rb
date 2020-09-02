# :nodoc:
class SearchController < ManageMetadataController
  include SearchHelper

  RESULTS_PER_PAGE = 25

  def index
    permitted = params.to_unsafe_h unless params.nil?# need to understand what this is doing more, think related to nested parameters not permitted.

    page = permitted['page'].to_i || 1
    page = 1 if page < 1

    results_per_page = RESULTS_PER_PAGE

    @record_type = permitted['record_type']

    # set query
    @query = {}
    @query['keyword'] = permitted['keyword'] || ''
    @query['provider_id'] = permitted['provider_id'] unless params['provider_id'].blank?
    @query['sort_key'] = permitted['sort_key'] unless params['sort_key'].blank?
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
        get_collection_search_results(query)
      when 'variables'
        cmr_client.get_variables(query, token)
      when 'services'
        cmr_client.get_services(query, token)
      when 'tools'
        cmr_client.get_tools(query, token)
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

  def get_collection_search_results(query)
    # TODO: when CMR-6655 is worked we should be able to just do one search
    # umm_json results so this can be streamlined in MMT-2359
    umm_json_query = query.dup
    umm_json_query['include_granule_counts'] = true
    umm_json_results = cmr_client.get_collections(umm_json_query, token)
    return umm_json_results unless umm_json_results.success?

    # json results
    json_query = query.dup
    json_query['include_tags'] = '*'
    json_results = cmr_client.search_collections(json_query, token)

    if json_results.success?
      collate_collection_results(umm_json_results, json_results)
    else
      # if this call failed, tag counts will be 0 and we will display this flash message
      flash[:error] = "There was an error searching for Tags: #{json_results.error_message(i18n: I18n.t('controllers.search.get_collection_search_results.error'))}"
    end

    umm_json_results
  end

  def collate_collection_results(umm_json_results, json_results)
    # should have successful results from both searches
    umm_json_results.body['items'].each_with_index do |collection, index|
      json_collection = json_results.body.dig('feed', 'entry', index)
      next unless collection.fetch('meta', {})['concept-id'] == json_collection.fetch('id', nil)

      collection['added_fields'] ||= {}
      collection['added_fields']['tags'] = json_collection['tags']
    end
  end

  def proposal_mode_enabled?
    multi_mode_actions_allowed?
  end
end
