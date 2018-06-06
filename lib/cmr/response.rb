module Cmr
  # Wraps a Faraday::Response object with helper methods and methods specific to
  # interpreting ECHO responses
  class Response
    def initialize(faradayResponse)
      @response = faradayResponse
    end

    def error?
      status >= 400 || (body.is_a?(Hash) && body['errors'])
    end

    def success?
      !error?
    end

    def faraday_response
      @response
    end

    def body
      @response.body
    end

    def parsed_body
      Hash.from_xml(body)
    end

    def headers
      @response.headers
    end

    def status
      @response.status
    end

    def body_is_html?
      error? && headers['content-type'] == 'text/html'
    end

    def errors
      @errors ||= if body_is_html?
                    Rails.logger.error "CMR Error Response Body is a HTML document: #{body}"
                    ['There was an error with the operation you were trying to perform. There may be an issue with one of the services we depend on. Please contact your provider administrator or the CMR OPS team.']
                  elsif body['errors']
                    Array.wrap(body['errors'])
                  elsif body['error']
                    Array.wrap(body['error'])
                  else
                    []
                  end
    end

    def error_messages(i18n: nil)
      if !errors.blank?
        errors
      elsif i18n
        [i18n]
      else
        ['There was an error with the operation you were trying to perform.']
      end
    end

    def error_message(i18n: nil)
      message = error_messages(i18n: i18n).first
      if message.is_a?(Hash)
        message.fetch('errors', []).first
      else
        message
      end
    end

    def cmr_request_header
      headers.fetch('cmr-request-id', '')
    end
  end
end
