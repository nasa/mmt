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

    def timeout_error?
      status == 504
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
      return @errors if @errors.present?

      @errors = if body_is_html?
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
      remove_tokens_from_errors(@errors)
    end

    def error_messages(i18n: nil)
      if errors.present?
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
        temp = message.fetch('errors', []).first
        if temp.nil?
          temp = message.fetch('message', '')
        end
        message = temp
        message
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

    def clean_inspect(body_only: false)
      errors
      if faraday_response.env.fetch(:request_headers, {})['Authorization'] && !body_only
        clean_response = faraday_response.deep_dup

        bearer_token = clean_response.env[:request_headers].delete('Authorization')

        bearer_token_snippet = truncate_token(bearer_token)

        clean_response.env[:request_headers]['Authorization-snippet'] = bearer_token_snippet

        clean_response.inspect
      elsif body_only
        faraday_response.body.inspect
      else
        faraday_response.inspect
      end
    end

    # Clean tokens out of error messages in responses
    def remove_tokens_from_errors(input_errors)
      input_errors&.each do |error|
        # Ingest errors return as {errors => [{path => string, errors => string}]}
        # where path is a place in the metadata and the errors are content errors
        # There should not be tokens in these errors, so we can skip them.
        next if error.is_a?(Hash)

        # Match something that contains Token [<token>] and replace it where $1 = the first few chars of <token>
        error.gsub!(/Token \[(.*?)\]/) { |s| "Token beginning with #{truncate_token($1)}" }
      end

      input_errors
    end
  end
end
