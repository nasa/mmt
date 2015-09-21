module Cmr
  class CmrClient < BaseClient
    def get_collections(options={}, token=nil)
      if Rails.env.development? || Rails.env.test?
        url = 'http://localhost:3003/collections.umm-json'
      else
        url = '/search/collections.umm-json'
      end
      get(url, options, token_header(token))
    end

    def get_providers
      if Rails.env.development? || Rails.env.test?
        url = 'http://localhost:3002/providers'
      else
        url = '/ingest/providers'
      end
      response = Rails.cache.fetch('get_providers', expires_in: 1.hours) do
        get(url)
      end
      response
    end

    def get_provider_holdings(options={}, token=nil)
      if Rails.env.development? || Rails.env.test?
        url = 'http://localhost:3003/provider_holdings.json'
      else
        url = '/search/provider_holdings.json'
      end
      get(url, options, token_header(token))
    end

    def get_science_keywords
      if Rails.env.development? || Rails.env.test?
        url = 'http://localhost:3003/keywords/science_keywords'
      else
        url = '/search/keywords/science_keywords'
      end
      get(url).body
    end

    def translate_collection(draft_metadata, from_format, to_format)
      if Rails.env.development? || Rails.env.test?
        url = 'http://localhost:3002/translate/collection'
      else
        url = '/ingest/translate/collection'
      end
      headers = {
        'Content-Type' => from_format,
        'Accept' => to_format
      }
      post(url, draft_metadata, headers)
    end

    def validate_collection(metadata, provider_id, draft_id, token)
      if Rails.env.development? || Rails.env.test?
        url = "http://localhost:3002/providers/#{provider_id}/validate/collection/#{draft_id}"
      else
        url = "/ingest/providers/#{provider_id}/validate/collection/#{draft_id}"
      end
      headers = {
        'Content-Type' => 'application/iso19115+xml'
      }
      post(url, metadata, headers.merge(token_header(token)))
    end

    def ingest_collection(metadata, provider_id, draft_id, token)
      draft_id = "mmt_draft_#{draft_id}"
      if Rails.env.development? || Rails.env.test?
        url = "http://localhost:3002/providers/#{provider_id}/collections/#{draft_id}"
      else
        url = "/ingest/providers/#{provider_id}/collections/#{draft_id}"
      end
      headers = {
        'Content-Type' => 'application/iso19115+xml'
      }
      put(url, metadata, headers.merge(token_header(token)))
    end

    def get_concept(concept_id, revision_id = nil)
      if Rails.env.development? || Rails.env.test?
        url = "http://localhost:3003/concepts/#{concept_id}#{'/' + revision_id if revision_id}"
      else
        url = "/search/concepts/#{concept_id}#{'/' + revision_id if revision_id}"
      end
      get(url).body
    end
  end
end
