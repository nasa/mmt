require 'faraday_middleware/response_middleware'

module Cmr
  module ClientMiddleware
    class ErrorMiddleware < FaradayMiddleware::ResponseMiddleware
      def process_response(env)
        env[:body] = [{ 'id' => nil, 'message' => 'System availability notifications may be unavailable for a brief period due to planned maintenance. We apologize for the inconvenience.' }]
      end

      def parse_response?(env)
        env[:status] == 503
      end
    end
  end
end
