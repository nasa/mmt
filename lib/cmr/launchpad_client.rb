module Cmr
  class LaunchpadClient < BaseClient
    def get_keep_alive(token)
      # get(url, params = {}, headers = {})
      get('/icam/api/sm/v1/keepalive', {}, 'Origin' => ENV['SAML_SP_ISSUER_BASE'], 'cookie' => "SBXSESSION=#{token}")
    end

    def get_launchpad_healthcheck
      get('/healthcheck')
    end
  end
end
