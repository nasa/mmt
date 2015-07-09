module Cmr
  class EchoClient < BaseClient
    def get_calendar_events
      get('/echo-rest/calendar_events.json', severity: 'ALERT')
    end
  end
end
