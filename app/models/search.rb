class Search

  def self.query_collections (entry_id_target, page, sort, results_per_page)

    client = Cmr::Client.client_for_environment(Rails.configuration.cmr_env, Rails.configuration.services)

    query_results = client.get_collections({"entry_id" => entry_id_target, 'page_num' => page, 'page_size' => results_per_page, 'sort_key' => sort})

    if (query_results.nil? || query_results.body.nil? || query_results.body["feed"].nil? || query_results.body["feed"]["entry"].nil?)
      table_rows = nil
      total_hit_count = 0
    else
      table_rows = query_results.body["feed"]["entry"]
      total_hit_count = query_results.headers['cmr-hits'].to_i
    end

    return table_rows, total_hit_count
  end

end