module Cmr
  class UrsClient < BaseClient
    include ProviderHoldings

    def urs_login_path(callback_url: ENV['urs_login_callback_url'], associate: false)
      callback_url = ENV['urs_association_callback_url'] if associate

      "#{@root}/oauth/authorize?client_id=#{@client_id}&redirect_uri=#{callback_url}&response_type=code"
    end

    def get_oauth_tokens(auth_code:, callback_url: ENV['urs_login_callback_url'], associate: false)
      callback_url = ENV['urs_association_callback_url'] if associate

      proposal_mode_safe_post('/oauth/token', "grant_type=authorization_code&code=#{auth_code}&redirect_uri=#{callback_url}")
    end

    def refresh_token(refresh_token)
      proposal_mode_safe_post('/oauth/token', "grant_type=refresh_token&refresh_token=#{refresh_token}")
    end

    def get_profile(endpoint, token)
      get(endpoint, { client_id: @client_id }, 'Authorization' => "Bearer #{token}")
    end

    def get_urs_users(uids)
      # Ensures a consistent query string for VCR
      uids.sort! if Rails.env.test?

      client_token = get_client_token
      get('/api/users', { uids: uids }, 'Authorization' => "Bearer #{client_token}")
    end

    def urs_email_exist?(query)
      client_token = get_client_token
      response = get('/api/users/verify_email', { email_address: query }, 'Authorization' => "Bearer #{client_token}")
      response.status == 200
    end

    def search_urs_users(query)
      client_token = get_client_token
      get('/api/users', { search: query }, 'Authorization' => "Bearer #{client_token}")
    end

    def get_urs_uid_from_nams_auid(auid)
      client_token = get_client_token
      response = get("/api/users/user_by_nams_auid/#{auid}", {}, 'Authorization' => "Bearer #{client_token}")
      # Rails.logger.info "urs uid from auid response: #{response.clean_inspect}"
      response
    end

    def associate_urs_uid_and_auid(urs_uid, auid)
      client_token = get_client_token
      response = proposal_mode_safe_post("/api/users/#{urs_uid}/add_nams_auid", "nams_auid=#{auid}", 'Authorization' => "Bearer #{client_token}")
      response
    end

    # Function to allow dMMT to authenticate a token from MMT.
    def validate_token(token, client_id)
      services = Rails.configuration.services
      config = services['earthdata'][Rails.configuration.cmr_env]
      dmmt_client_id = services['urs']['mmt_proposal_mode'][Rails.env.to_s][config['urs_root']]
      proposal_mode_safe_post("/oauth/tokens/user", "token=#{token}&client_id=#{dmmt_client_id}&on_behalf_of=#{client_id}")
    end

    def validate_mmt_token(token)
      services = Rails.configuration.services
      config = services['earthdata'][Rails.configuration.cmr_env]
      mmt_client_id = services['urs']['mmt_proper'][Rails.env.to_s][config['urs_root']]
      proposal_mode_safe_post("/oauth/tokens/user", "token=#{token}&client_id=#{mmt_client_id}")
    end

    def validate_dmmt_token(token)
      services = Rails.configuration.services
      config = services['earthdata'][Rails.configuration.cmr_env]
      dmmt_client_id = services['urs']['mmt_proposal_mode'][Rails.env.to_s][config['urs_root']]
      proposal_mode_safe_post("/oauth/tokens/user", "token=#{token}&client_id=#{dmmt_client_id}")
    end

    def create_edl_group(group)
      group['provider_id'] = 'CMR' if group['provider_id'].nil?
      concept_id = create_concept_id_from_group(group)
      response = proposal_mode_safe_post(
        '/api/user_groups',
        "name=#{group['name']}&description=#{URI.encode(group['description'])}&tag=#{group['provider_id']}",
        'Authorization' => "Bearer #{get_client_token}"
      )
      response.body['concept_id'] = concept_id if response.success?
      add_new_members(group['name'], group['members'], group['provider_id']) if group['members']
      response
    end

    def add_user_to_edl_group(user_id, group_name, provider_id)
      proposal_mode_safe_post(
        "/api/user_groups/#{group_name}/user",
        "user_id=#{user_id}&tag=#{provider_id}",
        'Authorization' => "Bearer #{get_client_token}"
      )
    end

    def remove_user_from_edl_group(user_id, group_name, provider_id)
      delete(
        "/api/user_groups/#{group_name}/user",
        { 'user_id' => user_id,
          'tag' => provider_id },
        nil,
        'Authorization' => "Bearer #{get_client_token}"
      )
    end

    def delete_edl_group(concept_id)
      name, provider_id = concept_id_to_name_provider(concept_id)
      delete(
        "/api/user_groups/#{name}",
        { 'tag' => provider_id },
        nil,
        'Authorization' => "Bearer #{get_client_token}"
      )
    end

    def get_edl_group(concept_id)
      name, provider_id = concept_id_to_name_provider(concept_id)
      response = get("/api/user_groups/#{name}",
                     { 'tag' => provider_id
                       },
                     'Authorization' => "Bearer #{get_client_token}")
      if response.success?
        response.body['concept_id'] = concept_id
        response.body['provider_id'] = provider_id
      end
      response
    end

    def get_edl_group_members(concept_id)
      name, provider_id = concept_id_to_name_provider(concept_id)
      response = get("/api/user_groups/group_members/#{name}",
                     { 'tag' => provider_id },
                       'Authorization' => "Bearer #{get_client_token}")
      users = response.body['users'] if response.success? && response.body.is_a?(Hash)
      return Cmr::Response.new(Faraday::Response.new(status: response.status, body: users.map { |user| user['uid'] } )) if users && users.length > 0

      # empty response case
      Cmr::Response.new(Faraday::Response.new(status: response.status, body: []))
    end

    def get_groups_for_provider_list(providers)
      groups = get_groups_for_providers(providers)
      groups.uniq { |group| group['name'] }
    end

    def get_groups_for_user_list(ids)
      return [] if ids.blank?

      groups = []
      ids.each { |user_id| groups += get_groups_for_user_id(user_id) }
      resp = groups.uniq { |group| group['name'] }
      reformat_search_results(resp)
    end

    def get_groups_for_providers(provider_ids)
      response = get('/api/user_groups/search',
                     {
                       'name' => ''
                     },
                     'Authorization' => "Bearer #{get_client_token}")
      return [] if response.error?

      # if provider_ids? is nil, filter out groups without tags
      response.body.select! do |x|
        provider_ids.nil? ? x['tag'] : provider_ids.include?(x['tag'])
      end
      response.body
    end

    def get_groups_for_user_id(user_id)
      response = get('/api/user_groups/search',
                     { 'user_id' => user_id },
                     'Authorization' => "Bearer #{get_client_token}")
      return [] if response.error?

      response.body
    end

    # Options can contain 3 keys:
    # provider: filter the groups using the specified provider list.
    # member: filter the groups using the specific member list.
    # show_system_groups: whether system groups should be included in the results
    # Note: If provider is nil has special meaning, it will return all groups (that have a tag)
    def get_edl_groups(options)
      providers = options['provider']

      unless providers.nil? || options['show_system_groups'].nil?
        providers << 'CMR' if options['show_system_groups']
      end

      # If no user filter, just do a provider level search.
      if options['member'].blank?
        provider_groups = get_groups_for_provider_list(providers)
        status = provider_groups.empty? ? 400 : 200
        return Cmr::Response.new(Faraday::Response.new(status: status, body: reformat_search_results(provider_groups, options[:page_num], options[:page_size])))
      end

      # Search by list of users, then filter that list by provider.
      users = options['member'] || []
      user_groups = get_groups_for_user_list(users)
      user_groups['items'].select! do |x|
        providers.nil? ? x['provider_id'] : providers.include?(x['provider_id'])
      end
      user_groups['hits'] = user_groups['items'].length
      Cmr::Response.new(Faraday::Response.new(status: 200, body: user_groups))
    end

    # TODO: This entire method should be transactional with rollback.s
    def update_edl_group(concept_id, group)
      new_description = group['description']

      group_members_response = get_edl_group_members(concept_id)
      existing_members = group_members_response.body if group_members_response.success?
      new_members = group['members']

      members_to_add = new_members.reject { |x| existing_members.include? x }
      name, provider_id = concept_id_to_name_provider(concept_id)
      add_new_members(name, members_to_add, provider_id)

      members_to_remove = existing_members.reject { |x| new_members.include? x }
      remove_old_members(name, members_to_remove, provider_id)

      response = proposal_mode_safe_post(
        "/api/user_groups/#{group['name']}/update",
        "tag=#{provider_id}&description=#{URI.encode(new_description)}",
        'Authorization' => "Bearer #{get_client_token}"
      )
      response.body['concept_id'] = concept_id
      response
    end

    def add_new_members(group_name, new_members, provider_id)
      new_members.each { |user_id| add_user_to_edl_group(user_id, group_name, provider_id) }
    end

    def remove_old_members(group_name, old_members, provider_id)
      old_members.each { |user_id| remove_user_from_edl_group(user_id, group_name, provider_id) }
    end

    protected

    def get_client_token
      # URS API says that the client token expires in 3600 (1 hr)
      # so cache token for one hour, and if needed will run request again
      client_access = Rails.cache.fetch('client_token', expires_in: 55.minutes) do
        proposal_mode_safe_post('/oauth/token', 'grant_type=client_credentials')
      end

      if client_access.success?
        client_access_token = client_access.body['access_token']
      else
        # Log error message
        Rails.logger.error("Client Token Request Error: #{client_access.inspect}")
      end

      client_access_token
    end

    def build_connection
      super.tap do |conn|
        conn.basic_auth(ENV['urs_username'], ENV['urs_password'])
      end
    end

    # make the search results match the structure of the cmr results
    def reformat_search_results(results, page_num=1, page_size=25)
      items = results.map do |item|
        { 'name' => item['name'],
          'description' => item['description'],
          'provider_id' => item['tag'],
          'concept_id' => create_concept_id_from_group(item)
        }
      end

      index = 0
      if (page_num)
        lower = (page_num-1)*page_size
        upper = (page_num)*page_size
      else
        lower = 0
        upper = 1000000
      end
      items.each do |item|
        if (index >= lower and index <= upper)
          item['member_count'] = get_edl_group_member_count(create_concept_id_from_group(item))
        else
          item['member_count']  = 0
        end
        index = index + 1
      end
      { 'hits' => items.length, 'items' => items }
    end

    def get_edl_group_member_count(concept_id)
      response = get_edl_group_members(concept_id)
      return response.body.length if response.success?
      0
    end

    # At this point, the EDL groups api does not support a unique group_identifier
    # such as a concept_id.  We construct one here and store it in the name field of the
    # group. This is a temporary fix until the api is enhanced.
    def create_concept_id_from_group(group)
      provider_id = group['provider_id'].nil? ? group['tag'] : group['provider_id']
      "#{group['name']}__#{provider_id}"
    end

    def concept_id_to_name_provider(concept_id)
      name = concept_id.split('__')[0]
      provider_id = concept_id.split('__')[1]
      [name, provider_id]
    end
  end
end
