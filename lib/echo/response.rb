module Echo
  # Custom response wrapper for Echo to handle parsing the body appropriately
  class Response
    def initialize(faraday_response)
      @response = faraday_response
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
      body = Hash.from_xml(self.body).fetch('Envelope', {}).fetch('Body', {})

      return body.fetch('Fault', {}) if status >= 400

      body.fetch(body.keys.first).fetch('result', nil)
    end

    def parsed_error
      error = parsed_body.fetch('faultstring')
      detail = parsed_body.fetch('detail', {}).fetch('SoapMessageValidationFault', '')

      [error, detail].join(': ')
    end

    def headers
      @response.headers
    end

    def status
      @response.status
    end
  end
end
