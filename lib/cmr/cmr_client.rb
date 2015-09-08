module Cmr
  class CmrClient < BaseClient

    # Example for pulling collections from CMR. (Search Epic will use this)
    # To get list of collections:
    # client = Cmr::Client.client_for_environment('sit', Rails.configuration.services)
    # client.get_collections().body['feed']['entry']
    # TODO this is currently using the CMR Search API. We will switch to the CMR Ingest API when we get access.
    def get_collections(options={}, token=nil)
      if Rails.env.development? || Rails.env.test?
        url = 'http://localhost:3003/collections.umm-json'
      else
        url = '/search/collections.umm-json'
      end
      get(url, options, token_header(token))
    end

    def get_providers
      holdings = get_provider_holdings.body
      holdings.map{ |holding| holding['provider-id'] }.uniq.sort
    end

    def get_provider_summaries
      if Rails.env.development? || Rails.env.test?
        url = 'http://localhost:3002/providers'
      else
        url = '/ingest/providers'
      end
      get(url)
    end

    def get_provider_holdings(options={}, token=nil)
      if Rails.env.development? || Rails.env.test?
        url = 'http://localhost:3003/provider_holdings.json'
      else
        url = '/search/provider_holdings.json'
      end
      get(url, options, token_header(token))
    end

  end
end
