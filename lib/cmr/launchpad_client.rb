module Cmr
  # this client connects to the launchpad `apps` subdomain for the keep alive endpoint, which is a different namespace than the token service
  class LaunchpadClient < BaseClient
    def keep_alive(token)
      # .../pub/... should be availible from 2019-08-03 in SBX and OPS till
      # the end of 2019-09-11
      get('/icam/api/pub/sm/v1/keepalive', {}, 'Origin' => ENV['SAML_SP_ISSUER_BASE'], 'cookie' => "#{Rails.configuration.launchpad_cookie_name}=#{token}")
    end

    def launchpad_healthcheck
      # check for a launchpad endpoint that should be a basic HTML page that returns http 200 and text OK if server is up and accessible
      get('/healthcheck')
    end
  end
end
