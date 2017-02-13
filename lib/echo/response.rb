require 'libxml_to_hash'

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
      # the libxml_to_hash gem helps us parse much larger xml files (and do it faster)
      # it will create nodes for xml tags that have attributes as well as values
      # but that doesn't seem to cause issues with the Echo SOAP responses

      body = Hash.from_libxml(self.body).fetch('Envelope', {}).fetch('Body', {})

      return body.fetch('Fault', {}) if status >= 400

      result = body.fetch(body.keys.first, {}).fetch('result', {})
      result = {} if result.nil?
      result
    end

    def error_type
      parsed_body.fetch('detail', {}).keys.first
    end

    def error_message
      parsed_body.fetch('faultstring')
    end

    def error_code
      parsed_body.fetch('detail', {}).fetch(error_type, {}).fetch('ErrorCode', nil)
    end

    def error_id
      parsed_body.fetch('detail', {}).fetch(error_type, {}).fetch('ErrorInstanceId', nil)
    end

    def headers
      @response.headers
    end

    def status
      @response.status
    end
  end
end
