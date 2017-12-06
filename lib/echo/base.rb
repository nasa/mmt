module Echo
  class Base
    def initialize(url, wsdl)
      @url = url
      @wsdl = wsdl
    end

    def connection
      @connection ||= build_connection
    end

    def build_connection
      Faraday.new(url: @url) do |conn|
        conn.use :instrumentation

        conn.adapter Faraday.default_adapter
      end
    end

    def make_request(url, body)
      parsed_body = Hash.send('from_xml', body).fetch('Envelope', {}).fetch('Body', {})

      Rails.logger.info("Soap call: URL: #{url}, params: #{parsed_body[parsed_body.keys.first].except('xmlns:ns2', 'xmlns:ns3', 'xmlns:ns4', 'token').inspect}")
      response = connection.post do |req|
        req.headers['Content-Type'] = 'text/xml'
        req.body = body
      end

      echo_response = Echo::Response.new(response)
      Rails.logger.info "SOAP Response: #{url} result : Headers: #{echo_response.headers} - Body Size (bytes): #{echo_response.body.to_s.bytesize} Status: #{echo_response.status}"
      echo_response
    end

    def wrap_with_envelope(content)
      builder = Builder::XmlMarkup.new
      builder.instruct!(:xml, encoding: 'UTF-8')

      builder.tag!(:'SOAP-ENV:Envelope', 'xmlns:SOAP-ENV': 'http://schemas.xmlsoap.org/soap/envelope/', 'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema', 'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance') do
        builder.tag!(:'SOAP-ENV:Header')
        builder.tag!(:'SOAP-ENV:Body') do
          builder << content
        end
      end
    end
  end
end
