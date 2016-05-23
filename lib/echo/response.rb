module Echo
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
      body = Hash.from_xml(self.body).fetch("Envelope", {}).fetch("Body", {})

      if self.status == 200
        method_name = body.keys.first

        return body.fetch(method_name).fetch("result", nil)
      else
        return body.fetch("Fault", {})
      end
    end

    def headers
      @response.headers
    end

    def status
      @response.status
    end
  end
end
