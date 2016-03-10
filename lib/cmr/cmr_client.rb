module Cmr
  class CmrClient < BaseClient
    def get_collections(options = {}, token = nil)
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

    def get_provider_holdings(provider_id = nil, token = nil)
      if Rails.env.development? || Rails.env.test?
        url = 'http://localhost:3003/provider_holdings.json'
      else
        url = '/search/provider_holdings.json'
      end

      options = {}
      options[:provider_id] = provider_id if provider_id

      response = Rails.cache.fetch("get_provider_holdings_#{provider_id || 'all'}", expires_in: 1.hours) do
        get(url, options, token_header(token))
      end
      response
    end

    def get_controlled_keywords(type)
      if Rails.env.development? || Rails.env.test?
        url = "http://localhost:3003/keywords/#{type}"
      else
        url = "/search/keywords/#{type}"
      end
      get(url).body
    end

    def translate_collection(draft_metadata, from_format, to_format, skip_validation = false)
      if Rails.env.development? || Rails.env.test?
        url = 'http://localhost:3002/translate/collection'
      else
        url = '/ingest/translate/collection'
      end
      url += '?skip_umm_validation=true' if skip_validation

      headers = {
        'Content-Type' => from_format,
        'Accept' => to_format
      }
      post(url, draft_metadata, headers)
    end

    def ingest_collection(metadata, provider_id, native_id, token)
      if Rails.env.development? || Rails.env.test?
        url = "http://localhost:3002/providers/#{provider_id}/collections/#{native_id}"
      else
        url = "/ingest/providers/#{provider_id}/collections/#{native_id}"
      end
      headers = {
        'Content-Type' => "application/#{Rails.configuration.umm_version}"
      }
      put(url, metadata, headers.merge(token_header(token)))
    end

    def get_concept(concept_id, token, revision_id = nil)
      if Rails.env.development? || Rails.env.test?
        url = "http://localhost:3003/concepts/#{concept_id}#{'/' + revision_id if revision_id}"
      else
        url = "/search/concepts/#{concept_id}#{'/' + revision_id if revision_id}"
      end
      get(url, {}, token_header(token)).body
    end

    def delete_collection(provider_id, native_id, token)
      if Rails.env.development? || Rails.env.test?
        url = "http://localhost:3002/providers/#{provider_id}/collections/#{native_id}"
      else
        url = "/ingest/providers/#{provider_id}/collections/#{native_id}"
      end
      headers = {
        'Accept' => 'application/json'
      }
      delete(url, {}, headers.merge(token_header(token)))
    end

    # This method will be replaced by the work from CMR-2053, including granule counts in umm-json searches
    def get_granule_count(collection_id, token)
      if Rails.env.development? || Rails.env.test?
        url = 'http://localhost:3003/collections.json'
      else
        url = '/search/collections.json'
      end
      options = {
        concept_id: collection_id,
        include_granule_counts: true
      }
      get(url, options, token_header(token)).body['feed']['entry'].first
    end

    def get_language_codes
      # Will be replaced by CMR at some point
      codes = File.readlines(File.join(Rails.root, 'lib', 'assets', 'language_codes')).map do |line|
        parts = line.split('|')
        { parts[3] => parts[0] }
      end

      codes.reduce({}, :merge)
    end

    def get_cmr_groups(options, token)
      if Rails.env.development? || Rails.env.test?
        url = 'http://localhost:3011/groups'
      else
        url = '/access-control/groups'
      end
      get(url, options, token_header(token))
    end

    def create_group(group, token)
      if Rails.env.development? || Rails.env.test?
        url = 'http://localhost:3011/groups'
      else
        url = '/access-control/groups'
      end
      headers = {
        'Content-Type' => 'application/json'
      }
      post(url, group, headers.merge(token_header(token)))
    end

    def get_group(concept_id, token)
      if Rails.env.development? || Rails.env.test?
        url = "http://localhost:3011/groups/#{concept_id}"
      else
        url = "/access-control/groups/#{concept_id}"
      end
      get(url, {}, token_header(token))
    end

    def add_users_to_local_cmr(user_uids, token) # need token?
      # curl -H "Content-Type: application/json" http://localhost:3008/urs/users -d
      # '[{"username": "user1", "password": "user1pass"}, ...]'
      # local cmr requires 'username' and 'password' fields
      users = user_uids.map { |uid| { 'username' => uid, 'password' => 'password'} }
      url = 'http://localhost:3008/urs/users'
      post(url, users.to_json, token_header(token))
    end

    def add_group_members(concept_id, user_uids, token)
      # if using local cmr, need to add users to it
      if Rails.env.development? || Rails.env.test?
        add_users_to_local_cmr(user_uids, token)
        url = "http://localhost:3011/groups/#{concept_id}/members"
      else
        url = "/access-control/groups/#{concept_id}/members"
      end
      post(url, user_uids.to_json, token_header(token))
    end

    def get_group_members(concept_id, token)
      if Rails.env.development? || Rails.env.test?
        url = "http://localhost:3011/groups/#{concept_id}/members"
      else
        url = "/access-control/groups/#{concept_id}/members"
      end
      get(url, {}, token_header(token))
    end
  end
end
