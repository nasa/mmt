module Cmr
  class EchoClient < BaseClient
    def get_calendar_events
      get('/echo-rest/calendar_events.json', severity: 'ALERT')
    end

    def get_echo_provider_holdings
      get('https://api.echo.nasa.gov/echo-rest/providers.json?id=LPDAAC_ECS')
    end
  end

end
