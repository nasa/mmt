module Cmr
  class UrsClient < BaseClient
    def urs_login_path(callback_url = ENV['urs_callback_url'])
      "#{@root}/oauth/authorize?client_id=#{@client_id}&redirect_uri=#{callback_url}&response_type=code"
    end

    def get_oauth_tokens(auth_code, callback_url = ENV['urs_callback_url'])
      Cmr::Response.new(connection.post("/oauth/token?grant_type=authorization_code&code=#{auth_code}&redirect_uri=#{callback_url}"))
    end

    def refresh_token(refresh_token)
      Cmr::Response.new(connection.post("/oauth/token?grant_type=refresh_token&refresh_token=#{refresh_token}"))
    end

    def get_profile(endpoint, token)
      Cmr::Response.new(connection.get(endpoint, { client_id: @client_id }, 'Authorization' => "Bearer #{token}"))
    end

    protected

    def build_connection
      super.tap do |conn|
        conn.basic_auth(ENV['urs_username'], ENV['urs_password'])
      end
    end
  end
end
