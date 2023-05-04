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
      name = group['name'] || ''
      description = group['description'] || ''
      provider_id = group['provider_id'] || ''
      response = post(
        '/api/user_groups',
        "name=#{name}&description=#{URI.encode(description)}&tag=#{provider_id}",
        'Authorization' => "Bearer #{get_client_token}"
      )
      if response.success?
        group_id = response.body['group_id']
        add_new_members(group_id, group['members']) if group['members']
      end
      response.body['provider_id'] = response.body['tag'] if response.body['provider_id'].nil?
      response
    end

    def add_user_to_edl_group(user_id, group_id)
      proposal_mode_safe_post(
        "/api/user_groups/#{group_id}/user",
        "user_id=#{user_id}",
        'Authorization' => "Bearer #{get_client_token}"
      )
    end

    def remove_user_from_edl_group(user_id, group_id)
      delete(
        "/api/user_groups/#{group_id}/user",
        { 'user_id' => user_id },
        nil,
        'Authorization' => "Bearer #{get_client_token}"
      )
    end

    def delete_edl_group(group_id)
      response = delete(
        "/api/user_groups/#{group_id}",
        {},
        nil,
        'Authorization' => "Bearer #{get_client_token}"
      )
      response.body['provider_id'] = response.body['tag'] if response.body['provider_id'].nil?
      response
    end

    def get_edl_group(group_id)
      response = get("/api/user_groups/#{group_id}",
                     {},
                     'Authorization' => "Bearer #{get_client_token}")

      response.body['provider_id'] = response.body['tag'] if response.body['provider_id'].nil?
      response
    end

    def get_edl_group_members(group_id)
      response = get("/api/user_groups/group_members/#{group_id}",
                     {},
                       'Authorization' => "Bearer #{get_client_token}")
      users = response.body['users'] if response.success? && response.body.is_a?(Hash)
      return Cmr::Response.new(Faraday::Response.new(status: response.status, body: users.map { |user| user['uid'] } )) if users && users.length > 0

      # empty response case
      Cmr::Response.new(Faraday::Response.new(status: response.status, body: []))
    end

    def get_all_groups
      response = get('/api/user_groups/search',
                     {
                       'name' => ''
                     },
                     'Authorization' => "Bearer #{get_client_token}")
      return [] if response.error?
      groups = response.body
      groups.uniq { |group| group['group_id'] }
    end

    def get_groups_for_user_list(ids)
      return [] if ids.blank?

      groups = []
      ids.each { |user_id| groups += get_groups_for_user_id(user_id) }
      groups.uniq { |group| group['name'] }
    end

    def get_groups_for_user_id(user_id)
      response = get('/api/user_groups/search',
                     { 'user_ids' => user_id },
                     'Authorization' => "Bearer #{get_client_token}")
      return [] if response.error?

      response.body
    end

    def get_groups_for_name(name)
      response = get('/api/user_groups/search',
                     {
                       'name' => name
                     },
                     'Authorization' => "Bearer #{get_client_token}")
      return [] if response.error?
      return response
    end

    # Options can contain 3 keys:
    # provider: filter the groups using the specified provider list.
    # member: filter the groups using the specific member list.
    # show_system_groups: whether system groups should be included in the results
    # Note: If provider is nil has special meaning, it will return all groups (that have a tag)
    def get_edl_groups(options, include_member_counts=true)
      providers = options['provider']

      show_system_groups = options['show_system_groups'] || false

      # provider search
      if options['member'].blank?
        provider_groups = get_all_groups()
        filter_by_provider(provider_groups, providers, show_system_groups)
        status = provider_groups.empty? ? 400 : 200
        results = reformat_search_results(provider_groups)
        update_member_counts(results["items"], options[:page_num], options[:page_size])
        return Cmr::Response.new(Faraday::Response.new(status: status, body: results))
      end

      # Search by list of users, then filter that list by provider.
      users = options['member'] || []
      user_groups = get_groups_for_user_list(Array.wrap(users))
      filter_by_provider(user_groups, providers, show_system_groups)
      status = user_groups.empty? ? 400 : 200
      results = reformat_search_results(user_groups)
      update_member_counts(results["items"], options[:page_num], options[:page_size]) unless !include_member_counts
      results['hits'] = results['items'].length
      Cmr::Response.new(Faraday::Response.new(status: status, body: results))
    end

    # TODO: This entire method should be transactional with rollback.s
    def update_edl_group(group_id, group)
      new_description = group['description'] || ''

      response = post(
        "/api/user_groups/#{group_id}/update",
        "&description=#{URI.encode(new_description)}",
        'Authorization' => "Bearer #{get_client_token}"
      )

      if response.success?
        group_members_response = get_edl_group_members(group_id)
        existing_members = group_members_response.body if group_members_response.success?
        if existing_members.nil?
          existing_members = []
        end
        new_members = group['members'] || []

        members_to_add = new_members.reject { |x| existing_members.include? x }
        add_new_members(group_id, members_to_add)

        members_to_remove = existing_members.reject { |x| new_members.include? x }
        remove_old_members(group_id, members_to_remove)
      end

      response.body['provider_id'] = response.body['tag'] if response.body['provider_id'].nil?
      response.body['group_id'] = group_id
      response
    end

    def add_new_members(group_id, new_members)
      new_members.each { |user_id| add_user_to_edl_group(user_id, group_id) }
    end

    def remove_old_members(group_id, old_members)
      old_members.each { |user_id| remove_user_from_edl_group(user_id, group_id) }
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

    # fetches member counts for a slice of the array starting at page_num
    def update_member_counts(items, page_num=1, page_size=25)
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
          item['member_count'] = get_edl_group_member_count(item['group_id'])
        else
          item['member_count']  = 0
        end
        index = index + 1
      end
    end

    # make the search results match the structure of the cmr results
    def reformat_search_results(results)
      results = results.map do |item|
        { 'group_id' => item['group_id'],
          'name' => item['name'],
          'description' => item['description'],
          'provider_id' => item['tag']
        }
      end
      { 'hits' => results.length, 'items' => results }
    end

    def get_edl_group_member_count(group_id)
      response = get_edl_group_members(group_id)
      return response.body.length if response.success?
      0
    end

    private

    def filter_by_provider(groups, providers, show_system_groups)
      if providers.nil?
        groups.select! do |x|
          tag = x['tag']
          unless tag.blank?
            show_system_groups ? true : x['tag'] != 'CMR'
          end
        end
      else
        providers << 'CMR' if show_system_groups
        groups.select! do |x|
          tag = x['tag']
          unless tag.blank?
            providers.include?(tag)
          end
        end
      end
    end
  end
end
