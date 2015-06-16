class SearchController < ApplicationController

  def search1
    entry_id_target = params[:entry_id_target]

    client = Cmr::Client.client_for_environment(Rails.configuration.cmr_env, Rails.configuration.services)

    @query_results = client.get_collections("entry_id" => entry_id_target)

    if (@query_results.body.nil? || @query_results.body["feed"].nil? || @query_results.body["feed"]["entry"].nil?)
      t = nil
    else
      t = @query_results.body["feed"]["entry"]
      t = t + t + t + t # temp for testing
    end

    @table_rows = t #@query_results.body["feed"]["entry"]
  end

end
