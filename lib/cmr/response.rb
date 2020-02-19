module Cmr
  # Wraps a Faraday::Response object with helper methods and methods specific to
  # interpreting ECHO responses
  class Response
    include Cmr::Util

    def initialize(faradayResponse)
      @response = faradayResponse
    end

    def error?
      status >= 400 || (body.is_a?(Hash) && !body['errors'].blank?)
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
                  elsif body.is_a?(Hash)
                    if body['errors']
                      Array.wrap(body['errors'])
                    elsif body['error']
                      Array.wrap(body['error'])
                    end
                  elsif body.is_a?(String)
                    [body]
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

    def error_message(i18n: nil, force_i18n_preface: nil)
      message = error_messages(i18n: i18n).first
      if message.is_a?(Hash)
        message.fetch('errors', []).first
      else
        message
      end

      if force_i18n_preface && i18n && !message.include?(i18n)
        "#{i18n}. #{message}"
      else
        message
      end
    end

    def cmr_request_header
      headers.fetch('cmr-request-id', '')
    end

    def clean_inspect
      if faraday_response.env.fetch(:request_headers, {})['Echo-Token']
        clean_response = faraday_response.deep_dup

        echo_token = clean_response.env[:request_headers].delete('Echo-Token')

        echo_token_snippet = truncate_token(echo_token)

        clean_response.env[:request_headers]['Echo-Token-snippet'] = echo_token_snippet

        clean_response.inspect
      else
        faraday_response.inspect
      end
    end
  end
end
