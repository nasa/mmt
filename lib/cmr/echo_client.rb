module Cmr
  class EchoClient < BaseClient
    def get_calendar_events
      return Cmr::Response.new(Faraday::Response.new)
    end

    def get_echo_provider_holdings(provider_id)
      get("/echo-rest/providers/#{provider_id}.json")
    end

    def get_current_user(token)
      get('/echo-rest/users/current.json', {}, token_header(token, true))
    end

    def get_groups(user_id)
      get("/echo-rest/groups.json?member_id=#{user_id}", {}, system_token_header)
    end

    def get_provider_acls
      get('/echo-rest/acls.json?object_identity_type=PROVIDER_OBJECT&reference=false', {}, system_token_header)
    end

    def get_all_providers
      get('/echo-rest/providers.json')
    end
  end
end
