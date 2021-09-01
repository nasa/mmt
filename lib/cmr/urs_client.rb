module Cmr
  class UrsClient < BaseClient
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
  end
end
