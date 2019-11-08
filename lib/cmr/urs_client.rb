module Cmr
  class UrsClient < BaseClient
    def urs_login_path(callback_url: ENV['urs_login_callback_url'], associate: false)
      callback_url = ENV['urs_association_callback_url'] if associate

      "#{@root}/oauth/authorize?client_id=#{@client_id}&redirect_uri=#{callback_url}&response_type=code"
    end

    def get_oauth_tokens(auth_code:, callback_url: ENV['urs_login_callback_url'], associate: false)
      callback_url = ENV['urs_association_callback_url'] if associate

      proposal_mode_safe_post("/oauth/token?grant_type=authorization_code&code=#{auth_code}&redirect_uri=#{callback_url}", {})
    end

    def refresh_token(refresh_token)
      proposal_mode_safe_post("/oauth/token?grant_type=refresh_token&refresh_token=#{refresh_token}", {})
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

    # On pause, we think we need to talk to EDL about SSO, maybe
    def retrieve_urs_profile_from_shared_token(token)

    end

#
#From Leo
#private String validateUrsAccessToken(String token) {
#            if (token == null) {
#                return null;
#            }
#
#            String accessToken = token.split(URS_SSO_TOKEN_SEPARATOR)[0];
#            String clientId = token.split(URS_SSO_TOKEN_SEPARATOR)[1];
#            String echoClientId = mEchoProperties.getProperty(EchoProperties2.URS_SSO_ECHO_CLIENT_ID);
#
#            String uri = mEchoProperties.getProperty(EchoProperties2.URS4_SSO_ROOT_URL)
#                    + mEchoProperties.getProperty(EchoProperties2.URS_SSO_VALIDATE_ACCESS_TOKEN_ENDPOINT);
#            String request = URS_SSO_ACCESS_TOKEN_PARAM_NAME + URS_SSO_EQUAL + accessToken
#                    + URS_SSO_PARAM_CONNECTOR + URS_SSO_CLIENT_ID_PARAM_NAME + URS_SSO_EQUAL + echoClientId
#                    + URS_SSO_PARAM_CONNECTOR + URS_SSO_ON_BEHALF_OF_PARAM_NAME + URS_SSO_EQUAL + clientId;
#
#            return (new UrsSsoResources()).postRequestToUrs(uri, request);
#      }
#    https://urs.earthdata.nasa.gov/oauth/tokens/user <--- Leo says it authorizes
    # On pause, we think we need to talk to EDL about SSO, maybe
    def validate_token(token)

    end

    protected

    def get_client_token
      # URS API says that the client token expires in 3600 (1 hr)
      # so cache token for one hour, and if needed will run request again
      client_access = Rails.cache.fetch('client_token', expires_in: 55.minutes) do
        proposal_mode_safe_post('/oauth/token?grant_type=client_credentials', {})
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
