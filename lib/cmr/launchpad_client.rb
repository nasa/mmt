module Cmr
  # this client connects to the launchpad `apps` subdomain for the keep alive endpoint
  class LaunchpadClient < BaseClient
    def get_keep_alive(token)
      get('/icam/api/sm/v1/keepalive', {}, 'Origin' => ENV['SAML_SP_ISSUER_BASE'], 'cookie' => "#{Rails.configuration.launchpad_cookie_name}=#{token}")
    end

    def get_launchpad_healthcheck
      # check for a launchpad endpoint that should be a basic HTML page that returns http 200 and text OK if server is up and accessible
      get('/healthcheck')
    end
  end
end
