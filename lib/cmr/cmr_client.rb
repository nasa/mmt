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
    def get_collections(options = {}, token = nil)
      # search collections via GET
      url = if Rails.env.development? || Rails.env.test?
              'http://localhost:3003/collections.umm-json'
            else
              '/search/collections.umm-json'
            end
      get(url, options, token_header(token))
    end

    def get_collections_by_post(query, token = nil, response_format = 'umm-json')
      # search collections via POST, with sort key default
      defaults = {
        'sort_key' => 'entry_title'
      }

      query = defaults.merge(query)

      url = if Rails.env.development? || Rails.env.test?
              "http://localhost:3003/collections.#{response_format}"
            else
              "/search/collections.#{response_format}"
            end

      headers = { 'Content-Type' => 'application/x-www-form-urlencoded' }

      post(url, query.to_query, headers.merge(token_header(token)))
    end

    def get_variables(options = {}, token = nil)
      url = if Rails.env.development? || Rails.env.test?
              'http://localhost:3003/variables.umm_json'
            else
              '/search/variables.umm_json'
            end

      get(url, options, token_header(token))
    end

    def get_services(options = {}, token = nil)
      url = if Rails.env.development? || Rails.env.test?
              'http://localhost:3003/services.umm_json'
            else
              '/search/services.umm_json'
            end

      get(url, options, token_header(token))
    end

    def get_tools(options = {}, token = nil)
      url = if Rails.env.development? || Rails.env.test?
              'http://localhost:3003/tools.umm_json'
            else
              '/search/tools.umm_json'
            end

      get(url, options, token_header(token))
    end

    def search_collections(options = {}, token)
      # search collections via GET, using `.json` extension
      url = if Rails.env.development? || Rails.env.test?
              'http://localhost:3003/collections.json'
            else
              '/search/collections.json'
            end

      get(url, options, token_header(token))
    end

    # CMR can accept up to 500k characters to this GET endpoint, but advises
    # using the POST end point if you think you will need > 6k. We are using the
    # GET endpoint because the subscription service in CMR is currently using it
    # when CMR changes, we should update to the POST.
    def test_query(query, token, headers = {})
      url = if Rails.env.development? || Rails.env.test?
              "http://localhost:3003/granules.umm_json?#{query}"
            else
              "/search/granules.umm_json?#{query}"
            end

      get(url, nil, headers.merge(token_header(token)))
    end

    def add_collection_associations(concept_id, collection_ids, token, concept_type)
      url = if Rails.env.development? || Rails.env.test?
              "http://localhost:3003/#{concept_type}/#{concept_id}/associations"
            else
              "/search/#{concept_type}/#{concept_id}/associations"
            end

      headers = {
        'Content-Type' => 'application/json'
      }

      post(url, Array.wrap(collection_ids).map { |c| { 'concept_id' => c } }.to_json, headers.merge(token_header(token)))
    end

    def delete_collection_associations(concept_id, collection_ids, token, concept_type)
      url = if Rails.env.development? || Rails.env.test?
              "http://localhost:3003/#{concept_type}/#{concept_id}/associations"
            else
              "/search/#{concept_type}/#{concept_id}/associations"
            end

      headers = {
        'Content-Type' => 'application/json'
      }

      delete(url, nil, Array.wrap(collection_ids).map { |c| { 'concept_id' => c } }.to_json, headers.merge(token_header(token)))
    end

    def get_concept(concept_id, token, headers, revision_id = nil, download_format = nil)
      url = if Rails.env.development? || Rails.env.test?
              "http://localhost:3003/concepts/#{concept_id}"
            else
              "/search/concepts/#{concept_id}"
            end

      url += "/#{revision_id}" if revision_id
      url += ".#{download_format}?pretty=true" if download_format

      get(url, {}, headers.merge(token_header(token)))
    end

    def get_controlled_keywords(type)
      url = if Rails.env.development? || Rails.env.test?
              "http://localhost:3003/keywords/#{type}"
            else
              "/search/keywords/#{type}"
            end

      # Cache controlled keywords for 30 seconds
      # UMM forms will call get_controlled_keywords for every
      # keyword on the page
      response = Rails.cache.fetch("#{type}_keywords", expires_in: 30.seconds) do
        get(url)
      end
      response
    end

    def get_tag(tag_key)
      url = if Rails.env.development? || Rails.env.test?
              "http://localhost:3003/tags/#{tag_key}"
            else
              "/search/tags/#{tag_key}"
            end
      # needs to be specified or the error will can come back as xml
      headers = { 'Content-Type' => 'application/json' }

      # tag Read doesn't seem to require tokens
      get(url, {}, headers)
    end

    def get_tags(options)
      url = if Rails.env.development? || Rails.env.test?
              'http://localhost:3003/tags'
            else
              '/search/tags'
            end
      # needs to be specified or the error will can come back as xml
      headers = { 'Content-Type' => 'application/json' }

      # tag Read doesn't seem to require tokens
      get(url, options, headers)
    end

    # MMT does not allow users to create and associate tags, but we need to
    # have these methods for testing purposes
    def create_tag(tag_key, token, description = nil)
      url = 'http://localhost:3003/tags'
      body = { tag_key: tag_key }
      body[:description] = description unless description.nil?
      headers = { 'Content-Type' => 'application/json' }
      # need to use 'access_token_admin'
      post(url, body.to_json, headers.merge(token_header(token)))
    end

    def associate_tag_by_collection_short_name(tag_key, short_name, token)
      url = "http://localhost:3003/tags/#{tag_key}/associations/by_query"
      body = { condition: { short_name: short_name } }
      headers = { 'Content-Type' => 'application/json' }

      post(url, body.to_json, headers.merge(token_header(token)))
    end

    ### Providers, via CMR Ingest and CMR Search

    def get_providers(force_write = false)
      url = if Rails.env.development? || Rails.env.test?
              'http://localhost:3002/providers'
            else
              '/ingest/providers'
            end

      force_write = true if Rails.cache.fetch('get_providers').nil? || !Rails.cache.fetch('get_providers').body.is_a?(Array)

      response = Rails.cache.fetch('get_providers', expires_in: 1.hours, force: force_write) do
        get(url)
      end
      response
    end

    def get_provider_holdings(cached = true, provider_id = nil, token = nil)
      url = if Rails.env.development? || Rails.env.test?
              'http://localhost:3003/provider_holdings.json'
            else
              '/search/provider_holdings.json'
            end

      options = {}
      options[:provider_id] = provider_id if provider_id

      response = if cached
                   Rails.cache.fetch("get_provider_holdings_#{provider_id || 'all'}", expires_in: 1.hours) do
                     get(url, options, token_header(token))
                   end
                 else
                   get(url, options, token_header(token))
                 end
      response
    end

    ### CMR Ingest

    def translate_collection(draft_metadata, from_format, to_format, skip_validation = false)
      url = if Rails.env.development? || Rails.env.test?
              'http://localhost:3002/translate/collection'
            else
              '/ingest/translate/collection'
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
      url = if Rails.env.development? || Rails.env.test?
              "http://localhost:3002/providers/#{provider_id}/collections/#{encode_if_needed(native_id)}"
            else
              "/ingest/providers/#{provider_id}/collections/#{encode_if_needed(native_id)}"
            end

      headers = {
        'Accept' => 'application/json',
        'Content-Type' => "application/#{Rails.configuration.umm_c_version}; charset=utf-8"
      }

      # content_type is passed if we are reverting to a revision with a different format
      headers['Content-Type'] = content_type if content_type

      put(url, metadata, headers.merge(token_header(token)))
    end

    # Only for testing
    # Publish a collection for progressive update feature - CMR allowing an update
    # to an existing collection that may include some existing errors if it does
    # not have new errors
    def ingest_progressive_update_collection(metadata, provider_id, native_id)
      # this is only for testing as it requires the system token and a special header
      return unless Rails.env.development? || Rails.env.test?

      # if native_id is not url friendly or encoded, it will throw an error so we check and prevent that
      url = "http://localhost:3002/providers/#{provider_id}/collections/#{encode_if_needed(native_id)}"

      headers = {
        'Accept' => 'application/json',
        'Content-Type' => "application/#{Rails.configuration.umm_c_version}; charset=utf-8",
        'Cmr-Test-Existing-Errors' => 'true',
        'Echo-Token' => 'mock-echo-system-token'
      }

      put(url, metadata, headers)
    end

    def delete_collection(provider_id, native_id, token)
      # if native_id is not url friendly or encoded, it will throw an error so we check and prevent that
      url = if Rails.env.development? || Rails.env.test?
              "http://localhost:3002/providers/#{provider_id}/collections/#{encode_if_needed(native_id)}"
            else
              "/ingest/providers/#{provider_id}/collections/#{encode_if_needed(native_id)}"
            end
      headers = {
        'Accept' => 'application/json'
      }
      delete(url, {}, nil, headers.merge(token_header(token)))
    end

    def validate_collection(metadata, provider_id, native_id)
      # if native_id is not url friendly or encoded, it will throw an error so we check and prevent that
      url = if Rails.env.development? || Rails.env.test?
              "http://localhost:3002/providers/#{provider_id}/validate/collection/#{encode_if_needed(native_id)}"
            else
              "/ingest/providers/#{provider_id}/validate/collection/#{encode_if_needed(native_id)}"
            end

      headers = {
        'Accept' => 'application/json',
        'Content-Type' => "application/#{Rails.configuration.umm_c_version}; charset=utf-8"
      }

      post(url, metadata, headers)
    end

    def ingest_variable(metadata:, provider_id:, native_id:, collection_concept_id:, token:, headers_override: nil)
      # if native_id is not url friendly or encoded, it will throw an error so we check and prevent that
      # https://cmr.sit.earthdata.nasa.gov/ingest/collections/C1200000005-PROV1/1/variables/sampleVariableNativeId33 -d \

      url = if Rails.env.development? || Rails.env.test?
              "http://localhost:3002/collections/#{collection_concept_id}/variables/#{encode_if_needed(native_id)}"
            else
              "/ingest/collections/#{collection_concept_id}/variables/#{encode_if_needed(native_id)}"
            end
      # url = if Rails.env.development? || Rails.env.test?
      #         "http://localhost:3002/providers/#{provider_id}/variables/#{encode_if_needed(native_id)}"
      #       else
      #         "/ingest/providers/#{provider_id}/variables/#{encode_if_needed(native_id)}"
      #       end

      headers = {
        'Accept' => 'application/json',
        'Content-Type' =>  "application/#{Rails.configuration.umm_var_version}; charset=utf-8"
      }

      headers.merge!(headers_override) if headers_override

      put(url, metadata, headers.merge(token_header(token)))
    end

    def ingest_service(metadata:, provider_id:, native_id:, token:, headers_override: nil, collection_concept_id: nil)
      # if native_id is not url friendly or encoded, it will throw an error so we check and prevent that
      url = if Rails.env.development? || Rails.env.test?
              "http://localhost:3002/providers/#{provider_id}/services/#{encode_if_needed(native_id)}"
            else
              "/ingest/providers/#{provider_id}/services/#{encode_if_needed(native_id)}"
            end

      headers = {
        'Accept' => 'application/json',
        'Content-Type' =>  "application/#{Rails.configuration.umm_s_version}; charset=utf-8"
      }

      headers.merge!(headers_override) if headers_override

      put(url, metadata, headers.merge(token_header(token)))
    end

    def delete_variable(provider_id, native_id, token)
      url = if Rails.env.development? || Rails.env.test?
              "http://localhost:3002/providers/#{provider_id}/variables/#{encode_if_needed(native_id)}"
            else
              "/ingest/providers/#{provider_id}/variables/#{encode_if_needed(native_id)}"
            end
      headers = {
        'Accept' => 'application/json'
      }
      delete(url, {}, nil, headers.merge(token_header(token)))
    end

    def delete_service(provider_id, native_id, token)
      url = if Rails.env.development? || Rails.env.test?
              "http://localhost:3002/providers/#{provider_id}/services/#{encode_if_needed(native_id)}"
            else
              "/ingest/providers/#{provider_id}/services/#{encode_if_needed(native_id)}"
            end
      headers = {
        'Accept' => 'application/json'
      }
      delete(url, {}, nil, headers.merge(token_header(token)))
    end

    ################ UMM-T #######################

    def ingest_tool(metadata:, provider_id:, native_id:, token:, content_type: nil, collection_concept_id: nil)
      # if native_id is not url friendly or encoded, it will throw an error so we check and prevent that
      url = if Rails.env.development? || Rails.env.test?
              "http://localhost:3002/providers/#{provider_id}/tools/#{encode_if_needed(native_id)}"
            else
              "/ingest/providers/#{provider_id}/tools/#{encode_if_needed(native_id)}"
            end

      headers = {
        'Accept' => 'application/json',
        'Content-Type' => "application/#{Rails.configuration.umm_t_version}; charset=utf-8"
      }

      # content_type is passed if we are reverting to a revision with a different format
      headers['Content-Type'] = content_type if content_type

      put(url, metadata, headers.merge(token_header(token)))
    end

    def delete_tool(provider_id, native_id, token)
      # if native_id is not url friendly or encoded, it will throw an error so we check and prevent that
      url = if Rails.env.development? || Rails.env.test?
              "http://localhost:3002/providers/#{provider_id}/tools/#{encode_if_needed(native_id)}"
            else
              "/ingest/providers/#{provider_id}/tools/#{encode_if_needed(native_id)}"
            end
      headers = {
        'Accept' => 'application/json'
      }
      delete(url, {}, nil, headers.merge(token_header(token)))
    end

    ############### End UMM-T ####################

    ### Subscriptions ###

    # Create and update
    def ingest_subscription(subscription, provider_id, native_id, token)
      url = if Rails.env.development? || Rails.env.test?
              "http://localhost:3002/providers/#{provider_id}/subscriptions/#{encode_if_needed(native_id)}"
            else
              "/ingest/providers/#{provider_id}/subscriptions/#{encode_if_needed(native_id)}"
            end
      headers = { 'Content-Type' => 'application/vnd.nasa.cmr.umm+json' }

      put(url, subscription, headers.merge(token_header(token)))
    end

    def delete_subscription(provider_id, native_id, token)
      url = if Rails.env.development? || Rails.env.test?
              "http://localhost:3002/providers/#{provider_id}/subscriptions/#{encode_if_needed(native_id)}"
            else
              "/ingest/providers/#{provider_id}/subscriptions/#{encode_if_needed(native_id)}"
            end
      headers = { 'Content-Type' => 'application/vnd.nasa.cmr.umm+json' }

      delete(url, {}, nil, headers.merge(token_header(token)))
    end

    # MMT does not need to ingest granules in any environment that is not dev or
    # test.
    def ingest_granule(metadata, provider_id, native_id)
      return unless Rails.env.development? || Rails.env.test?

      url = "http://localhost:3002/providers/#{provider_id}/granules/#{encode_if_needed(native_id)}"
      headers = {
        'Accept' => 'application/json',
        'Content-Type' =>  "application/vnd.nasa.cmr.umm+json; version=1.6; charset=utf-8"
      }

      put(url, metadata, headers.merge(token_header('token')))
    end

    #####################

    ### CMR Bulk Updates, via CMR Ingest

    def get_bulk_updates(provider_id, token, filters = {})
      # ingest/providers/<provider-id>/bulk-update/collections/status
      url = if Rails.env.development? || Rails.env.test?
              "http://localhost:3002/providers/#{provider_id}/bulk-update/collections/status"
            else
              "ingest/providers/#{provider_id}/bulk-update/collections/status"
            end

      headers = { 'Accept' => 'application/json; charset=utf-8' }

      get(url, filters, headers.merge(token_header(token)))
    end

    def get_bulk_update(provider_id, task_id, token)
      # ingest/providers/<provider-id>/bulk-update/collections/status/<task-id>
      url = if Rails.env.development? || Rails.env.test?
              "http://localhost:3002/providers/#{provider_id}/bulk-update/collections/status/#{task_id}"
            else
              "ingest/providers/#{provider_id}/bulk-update/collections/status/#{task_id}"
            end

      headers = { 'Accept' => 'application/json; charset=utf-8' }

      get(url, {}, headers.merge(token_header(token)))
    end

    def create_bulk_update(provider_id, params, token)
      # ingest/providers/<provider-id>/bulk-update/collections
      url = if Rails.env.development? || Rails.env.test?
              "http://localhost:3002/providers/#{provider_id}/bulk-update/collections"
            else
              "ingest/providers/#{provider_id}/bulk-update/collections"
            end

      headers = { 'Accept' => 'application/json; charset=utf-8' }

      post(url, params.to_json, headers.merge(token_header(token)))
    end

    ### CMR Groups, via Access Control

    def get_cmr_groups(options, token)
      url = if Rails.env.development? || Rails.env.test?
              'http://localhost:3011/groups'
            else
              '/access-control/groups'
            end
      get(url, options, token_header(token))
    end

    def create_group(group, token)
      url = if Rails.env.development? || Rails.env.test?
              add_users_to_local_cmr(group['members'], token) if group['members']
              'http://localhost:3011/groups'
            else
              '/access-control/groups'
            end
      headers = {
        'Content-Type' => 'application/json'
      }
      post(url, group.to_json, headers.merge(token_header(token)))
    end

    def update_group(concept_id, group, token)
      url = if Rails.env.development? || Rails.env.test?
              "http://localhost:3011/groups/#{concept_id}"
            else
              "/access-control/groups/#{concept_id}"
            end
      headers = {
        'Content-Type' => 'application/json'
      }
      put(url, group.to_json, headers.merge(token_header(token)))
    end

    def get_group(concept_id, token)
      url = if Rails.env.development? || Rails.env.test?
              "http://localhost:3011/groups/#{concept_id}"
            else
              "/access-control/groups/#{concept_id}"
            end
      get(url, {}, token_header(token))
    end

    def delete_group(concept_id, token)
      url = if Rails.env.development? || Rails.env.test?
              "http://localhost:3011/groups/#{concept_id}"
            else
              "/access-control/groups/#{concept_id}"
            end
      delete(url, {}, nil, token_header(token))
    end

    def add_users_to_local_cmr(user_uids, token) # need token?
      # curl -H "Content-Type: application/json" http://localhost:3008/urs/users -d
      # '[{"username": "user1", "password": "user1pass"}, ...]'
      # local cmr requires 'username' and 'password' fields but the actual password is unimportant
      users = user_uids.map { |uid| { 'username' => uid, 'password' => 'password' } }

      url = 'http://localhost:3008/urs/users'
      post(url, users.to_json, token_header(token))
    end

    def add_group_members(concept_id, user_uids, token)
      # if using local cmr, need to add users to it
      url = if Rails.env.development? || Rails.env.test?
              add_users_to_local_cmr(user_uids, token)
              "http://localhost:3011/groups/#{concept_id}/members"
            else
              "/access-control/groups/#{concept_id}/members"
            end
      post(url, user_uids.to_json, token_header(token))
    end

    def remove_group_members(concept_id, user_uids, token)
      url = if Rails.env.development? || Rails.env.test?
              "http://localhost:3011/groups/#{concept_id}/members"
            else
              "/access-control/groups/#{concept_id}/members"
            end
      delete(url, {}, user_uids.to_json, token_header(token))
    end

    def get_group_members(concept_id, token)
      url = if Rails.env.development? || Rails.env.test?
              "http://localhost:3011/groups/#{concept_id}/members"
            else
              "/access-control/groups/#{concept_id}/members"
            end
      get(url, {}, token_header(token))
    end

    ### CMR Permissions (aka ACLs), via Access Control

    def add_group_permissions(request_object, token)
      # Example: curl -XPOST -i -H "Content-Type: application/json" -H "Echo-Token: XXXXX" https://cmr.sit.earthdata.nasa.gov/access-control/acls -d \
      url = if Rails.env.development? || Rails.env.test?
              'http://localhost:3011/acls'
            else
              '/access-control/acls'
            end
      post(url, request_object.to_json, token_header(token))
    end

    def get_permissions(options, token)
      # Example: curl -i "http://localhost:3011/acls?provider=MMT_1&include_full_acl=true"
      url = if Rails.env.development? || Rails.env.test?
              'http://localhost:3011/acls'
            else
              '/access-control/acls'
            end
      # options = {'provider' => provider_id, 'include_full_acl' => true}
      get(url, options, token_header(token))
    end

    def get_permission(concept_id, token)
      # Example: curl -i "http://localhost:3011/acls/#{concept_id}"
      url = if Rails.env.development? || Rails.env.test?
              "http://localhost:3011/acls/#{concept_id}?include-full-acl=true"
            else
              "/access-control/acls/#{concept_id}?include-full-acl=true"
            end

      headers = {
        'Accept' => 'application/json; charset=utf-8'
      }

      response = get(url, {}, headers.merge(token_header(token)))

      response
    end

    def update_permission(request_object, concept_id, token, revision_id = nil)
      url = if Rails.env.development? || Rails.env.test?
              "http://localhost:3011/acls/#{concept_id}"
            else
              "/access-control/acls/#{concept_id}"
            end

      headers = { 'Content-Type' => 'application/json' }
      headers['Cmr-Revision-Id'] = revision_id if revision_id

      put(url, request_object.to_json, headers.merge(token_header(token)))
    end

    def delete_permission(concept_id, token, revision_id = nil)
      # curl -XDELETE -i -H "Echo-Token: mock-echo-system-token" https://cmr.sit.earthdata.nasa.gov/access-control/acls/ACL1200000000-CMR
      url = if Rails.env.development? || Rails.env.test?
              "http://localhost:3011/acls/#{concept_id}"
            else
              "/access-control/acls/#{concept_id}"
            end

      headers = { 'Content-Type' => 'application/json' }
      headers['Cmr-Revision-Id'] = revision_id if revision_id

      delete(url, {}, nil, headers.merge(token_header(token)))
    end

    def check_user_permissions(options, token)
      # https://cmr.sit.earthdata.nasa.gov/access-control/site/access_control_api_docs.html#get-permissions
      # one of `concept_id`, `system_object`(i.e. GROUP), or `provider` AND `target`(i.e. HOLDINGS)
      # one of `user_type`('guest' or 'registered') or `user_id`
      # example: curl -g -i -H "Echo-Token: XXXX" "https://cmr.sit.earthdata.nasa.gov/access-control/permissions?user_type=guest&concept_id[]=C1200000000-PROV1&concept_id[]=C1200000001-PROV1"
      url = if Rails.env.development? || Rails.env.test?
              'http://localhost:3011/permissions'
            else
              '/access-control/permissions'
            end

      headers = { 'Accept' => 'application/json; charset=utf-8' }

      get(url, options, headers.merge(token_header(token)))
    end

    def get_subscriptions(options = {}, token = nil)
      url = if Rails.env.development? || Rails.env.test?
              'http://localhost:3003/subscriptions.umm_json'
            else
              '/search/subscriptions.umm_json'
            end
      get(url, options, token_header(token))
    end

    private

    def valid_uri?(uri)
      !!URI.parse(uri)
    rescue URI::InvalidURIError
      false
    end

    def encode_if_needed(url_fragment)
      valid_uri?(url_fragment) ? url_fragment : URI.encode(url_fragment)
    end
  end
end
