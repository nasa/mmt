require 'faraday_middleware/response_middleware'

module Cmr
  module ClientMiddleware
    class EventMiddleware < FaradayMiddleware::ResponseMiddleware
      def process_response(env)

        current_time = DateTime.current.to_s

        # Uncomment the line below when developing so you might actually see a notification
        #current_time = (DateTime.current-(1.year)).to_s

        events = env[:body].delete_if {|event| event['calendar_event']['end_date'] < current_time }

        events.sort! {|x, y| x['calendar_event']['start_date'] <=> y['calendar_event']['start_date']}

        if !events.nil? && !events.empty?
          event = events[0]

          # Construct time range string. Adjust to Eastern Time
          start_date_obj = DateTime.parse(event['calendar_event']['start_date']).in_time_zone('Eastern Time (US & Canada)')
          start_date = start_date_obj.strftime('%-m/%-d/%Y')
          start_day_of_week = start_date_obj.strftime('%A')
          start_time = start_date_obj.strftime('%l %P')
          start_time = '12 Midnight' if start_time == '12 am'
          start_time = '12 Noon' if start_time == '12 pm'

          end_date_obj = DateTime.parse(event['calendar_event']['end_date']).in_time_zone('Eastern Time (US & Canada)')
          end_date = end_date_obj.strftime('%-m/%-d/%Y')
          end_time = end_date_obj.strftime('%l %P')
          end_time = '12 Midnight' if end_time == '12 am'
          end_time = '12 Noon' if end_time == '12 pm'

          if start_date == end_date # Outage does not span multiple days
            time_range_string = "on <strong>#{start_day_of_week}, #{start_date} between #{start_time} - #{end_time} ET</strong>"
          else
            end_day_of_week = end_date_obj.strftime('%A')
            time_range_string = "between <strong>#{start_day_of_week}, #{start_date} at #{start_time} and #{end_day_of_week}, #{end_date} at #{end_time} ET</strong>"
          end

          notification = "This site may be unavailable for a brief period due to planned maintenance #{time_range_string}. We apologize for the inconvenience."
        else
          notification = nil
        end

        env[:body] = notification

      end

      def parse_response?(env)
        body = env[:body]
        body.is_a?(Array) && body[0] && body[0]['calendar_event']
      end
    end
  end
end
