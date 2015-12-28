require 'faraday_middleware/response_middleware'

module Cmr
  module ClientMiddleware
    class EventMiddleware < FaradayMiddleware::ResponseMiddleware
      def process_response(env)
        body = env[:body]

        sanitizer = ActionView::Base.full_sanitizer
        now = DateTime.now

        # For testing uncomment this line
        # now = now - 5.years

        # Filter events that are not current and the ASTER GDEM V2 Tutorial hack event which shows
        # a Reverb tutorial.  NCRS have been filed to make this unnecessary.
        events = Array.wrap(body).reject do |event|
          calendar_event = event['calendar_event']
          title = calendar_event['title']
          end_date = calendar_event['end_date']

          title == 'ASTER GDEM V2 Tutorial' || (end_date.present? && end_date < now)
        end

        events.map! do |event|
          calendar_event = event['calendar_event']
          calendar_event['message'] = sanitizer.sanitize(calendar_event['message']).gsub('&nbsp;', ' ').gsub(/\s+/, ' ')

          calendar_event
        end

        env[:body] = events
      end

      def parse_response?(env)
        body = env[:body]
        body.is_a?(Array) && body[0] && body[0]['calendar_event']
      end
    end
  end
end
