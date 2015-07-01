module Cmr
  class CmrClient < BaseClient

    # Example for pulling collections from CMR. (Search Epic will use this)
    # To get list of collections:
    # client = Cmr::Client.client_for_environment('sit', Rails.configuration.services)
    # client.get_collections().body['feed']['entry']
    # TODO this is currently using the CMR Search API. We will switch to the CMR Ingest API when we get access.
    def get_collections(options={}, token=nil)
      format = options.delete(:format) || 'json'
      get("/concepts/search/collections", options, token_header(token))
    end
  end
end
