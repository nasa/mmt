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

    def body=(changed_body)
      @body = changed_body
    end

    def body
      @body || @response.body
    end

    def parsed_body
      Hash.from_xml(body)
    end

    # TODO: any changes made below this line were for development and testing purposes, and should be discarded
    def content_type=(changed_content_type)
      @headers = @response.headers.merge({ 'content-type' => changed_content_type })
    end

    def headers
      # @response.headers
      @headers || @response.headers
    end

    def status=(value)
      @status = value
    end

    def status
      # @response.status
      @status || @response.status
    end
  end
end
