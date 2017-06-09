module Cmr
  class CmrClient < BaseClient

    def get_language_codes
      # Will be replaced by CMR at some point
      codes = File.readlines(File.join(Rails.root, 'lib', 'assets', 'language_codes')).map do |line|
        parts = line.split('|')
        { parts[3] => parts[0] }
      end

      codes.reduce({}, :merge)
    end

    ### CMR Search

    # umm-json gives us shorter version of metadata in the 'umm' portion. but it has entry-id
    # umm_json gives us the metadata record in the 'umm' portion. but that does not include entry-id
    def get_collections(options = {}, token = nil, format = 'umm-json')
      if Rails.env.development? || Rails.env.test?
        url = "http://localhost:3003/collections.#{format}"
      else
        url = "/search/collections.#{format}"
      end
      get(url, options, token_header(token))
    end

    def get_collections_by_post(query, token = nil, format = 'umm-json')
      # search collections via POST
      if Rails.env.development? || Rails.env.test?
        url = "http://localhost:3003/collections.#{format}"
      else
        url = "/search/collections.#{format}"
      end

      headers = { 'Content-Type' => 'application/x-www-form-urlencoded' }

      post(url, query.to_query, headers.merge(token_header(token)))
    end

    def search_collections(options, token)
      if Rails.env.development? || Rails.env.test?
        url = 'http://localhost:3003/collections.json'
      else
        url = '/search/collections.json'
      end

      get(url, options, token_header(token))
    end

    def get_concept(concept_id, token, content_type, revision_id = nil)
      if Rails.env.development? || Rails.env.test?
        url = "http://localhost:3003/concepts/#{concept_id}#{'/' + revision_id.to_s if revision_id}"
      else
        url = "/search/concepts/#{concept_id}#{'/' + revision_id if revision_id}"
      end

      headers = {
        'Accept' => content_type
      }

      get(url, {}, headers.merge(token_header(token)))
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

    def get_controlled_keywords(type)
      if Rails.env.development? || Rails.env.test?
        url = "http://localhost:3003/keywords/#{type}"
      else
        url = "/search/keywords/#{type}"
      end
      get(url).body
    end

    ### Providers, via CMR Ingest and CMR Search

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

    def get_provider_holdings(cached = true, provider_id = nil, token = nil)
      if Rails.env.development? || Rails.env.test?
        url = 'http://localhost:3003/provider_holdings.json'
      else
        url = '/search/provider_holdings.json'
      end

      options = {}
      options[:provider_id] = provider_id if provider_id

      if cached
        response = Rails.cache.fetch("get_provider_holdings_#{provider_id || 'all'}", expires_in: 1.hours) do
          get(url, options, token_header(token))
        end
      else
        response = get(url, options, token_header(token))
      end
      response
    end

    ### CMR Ingest

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

    def ingest_collection(metadata, provider_id, native_id, token, content_type = nil)
      # if native_id is not url friendly or encoded, it will throw an error so we check and prevent that
      if Rails.env.development? || Rails.env.test?
        url = "http://localhost:3002/providers/#{provider_id}/collections/#{encode_if_needed(native_id)}"
      else
        url = "/ingest/providers/#{provider_id}/collections/#{encode_if_needed(native_id)}"
      end

      headers = {
        'Accept' => 'application/json',
        'Content-Type' => "application/#{Rails.configuration.umm_version}; charset=utf-8"
      }

      # content_type is passed if we are reverting to a revision with a different format
      headers['Content-Type'] = content_type if content_type

      put(url, metadata, headers.merge(token_header(token)))
    end

    def delete_collection(provider_id, native_id, token)
      # if native_id is not url friendly or encoded, it will throw an error so we check and prevent that
      if Rails.env.development? || Rails.env.test?
        url = "http://localhost:3002/providers/#{provider_id}/collections/#{encode_if_needed(native_id)}"
      else
        url = "/ingest/providers/#{provider_id}/collections/#{encode_if_needed(native_id)}"
      end
      headers = {
        'Accept' => 'application/json'
      }
      delete(url, {}, nil, headers.merge(token_header(token)))
    end

    ### CMR Bulk Updates, via CMR Ingest

    def get_bulk_updates(provider_id, token, filters = {})
      # ingest/providers/<provider-id>/bulk-update/collections/status
      if Rails.env.development? || Rails.env.test?
        url = "http://localhost:3002/providers/#{provider_id}/bulk-update/collections/status"
      else
        url = "ingest/providers/#{provider_id}/bulk-update/collections/status"
      end

      headers = { 'Accept' => 'application/json; charset=utf-8' }

      get(url, filters, headers.merge(token_header(token)))
    end

    def get_bulk_update(provider_id, task_id, token)
      # ingest/providers/<provider-id>/bulk-update/collections/status/<task-id>
      if Rails.env.development? || Rails.env.test?
        url = "http://localhost:3002/providers/#{provider_id}/bulk-update/collections/status/#{task_id}"
      else
        url = "ingest/providers/#{provider_id}/bulk-update/collections/status/#{task_id}"
      end

      headers = { 'Accept' => 'application/json; charset=utf-8' }

      get(url, {}, headers.merge(token_header(token)))
    end

    def create_bulk_update(provider_id, params, token)
      # ingest/providers/<provider-id>/bulk-update/collections
      if Rails.env.development? || Rails.env.test?
        url = "http://localhost:3002/providers/#{provider_id}/bulk-update/collections"
      else
        url = "ingest/providers/#{provider_id}/bulk-update/collections"
      end

      headers = { 'Accept' => 'application/json; charset=utf-8' }

      post(url, params.to_json, headers.merge(token_header(token)))
    end

    ### CMR Groups, via Access Control

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
        add_users_to_local_cmr(group['members'], token) if group['members']
      else
        url = '/access-control/groups'
      end
      headers = {
        'Content-Type' => 'application/json'
      }
      post(url, group.to_json, headers.merge(token_header(token)))
    end

    def update_group(concept_id, group, token)
      if Rails.env.development? || Rails.env.test?
        url = "http://localhost:3011/groups/#{concept_id}"
      else
        url = "/access-control/groups/#{concept_id}"
      end
      headers = {
        'Content-Type' => 'application/json'
      }
      put(url, group.to_json, headers.merge(token_header(token)))
    end

    def get_group(concept_id, token)
      if Rails.env.development? || Rails.env.test?
        url = "http://localhost:3011/groups/#{concept_id}"
      else
        url = "/access-control/groups/#{concept_id}"
      end
      get(url, {}, token_header(token))
    end

    def delete_group(concept_id, token)
      if Rails.env.development? || Rails.env.test?
        url = "http://localhost:3011/groups/#{concept_id}"
      else
        url = "/access-control/groups/#{concept_id}"
      end
      delete(url, {}, nil, token_header(token))
    end

    def add_users_to_local_cmr(user_uids, token) # need token?
      # curl -H "Content-Type: application/json" http://localhost:3008/urs/users -d
      # '[{"username": "user1", "password": "user1pass"}, ...]'
      # local cmr requires 'username' and 'password' fields
      users = user_uids.map { |uid| { 'username' => uid, 'password' => 'password' } }

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

    def remove_group_members(concept_id, user_uids, token)
      if Rails.env.development? || Rails.env.test?
        url = "http://localhost:3011/groups/#{concept_id}/members"
      else
        url = "/access-control/groups/#{concept_id}/members"
      end
      delete(url, {}, user_uids.to_json, token_header(token))
    end

    def get_group_members(concept_id, token)
      if Rails.env.development? || Rails.env.test?
        url = "http://localhost:3011/groups/#{concept_id}/members"
      else
        url = "/access-control/groups/#{concept_id}/members"
      end
      get(url, {}, token_header(token))
    end

    ### CMR Permissions (aka ACLs), via Access Control

    def add_group_permissions(request_object, token)
      # Example: curl -XPOST -i -H "Content-Type: application/json" -H "Echo-Token: XXXXX" https://cmr.sit.earthdata.nasa.gov/access-control/acls -d \
      if Rails.env.development? || Rails.env.test?
        url = 'http://localhost:3011/acls'
      else
        url = '/access-control/acls'
      end
      post(url, request_object.to_json, token_header(token))
    end

    def get_permissions(options, token)
      # Example: curl -i "http://localhost:3011/acls?provider=MMT_1&include_full_acl=true"
      if Rails.env.development? || Rails.env.test?
        url = 'http://localhost:3011/acls'
      else
        url = '/access-control/acls'
      end
      # options = {'provider' => provider_id, 'include_full_acl' => true}
      get(url, options, token_header(token))
    end

    def get_permission(concept_id, token)
      # Example: curl -i "http://localhost:3011/acls/#{concept_id}"
      if Rails.env.development? || Rails.env.test?
        url = "http://localhost:3011/acls/#{concept_id}?include-full-acl=true"
      else
        url = "/access-control/acls/#{concept_id}?include-full-acl=true"
      end

      headers = {
        'Accept' => 'application/json; charset=utf-8'
      }

      response = get(url, {}, headers.merge(token_header(token)))

      response
    end

    def update_permission(request_object, concept_id, token)
      if Rails.env.development? || Rails.env.test?
        url = "http://localhost:3011/acls/#{concept_id}"
      else
        url = "/access-control/acls/#{concept_id}"
      end

      headers = { 'Content-Type' => 'application/json' }

      put(url, request_object.to_json, headers.merge(token_header(token)))
    end

    def delete_permission(concept_id, token)
      # curl -XDELETE -i -H "Echo-Token: mock-echo-system-token" https://cmr.sit.earthdata.nasa.gov/access-control/acls/ACL1200000000-CMR
      if Rails.env.development? || Rails.env.test?
        url = "http://localhost:3011/acls/#{concept_id}"
      else
        url = "/access-control/acls/#{concept_id}"
      end

      delete(url, {}, nil, token_header(token))
    end

    def check_user_permissions(options, token)
      # https://cmr.sit.earthdata.nasa.gov/access-control/site/access_control_api_docs.html#get-permissions
      # one of `concept_id`, `system_object`(i.e. GROUP), or `provider` AND `target`(i.e. HOLDINGS)
      # one of `user_type`('guest' or 'registered') or `user_id`
      # example: curl -g -i -H "Echo-Token: XXXX" "https://cmr.sit.earthdata.nasa.gov/access-control/permissions?user_type=guest&concept_id[]=C1200000000-PROV1&concept_id[]=C1200000001-PROV1"
      if Rails.env.development? || Rails.env.test?
        url = 'http://localhost:3011/permissions'
      else
        url = '/access-control/permissions'
      end

      headers = { 'Accept' => 'application/json; charset=utf-8' }

      get(url, options, headers.merge(token_header(token)))
    end
  end
end
