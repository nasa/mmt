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
      response = connection.post do |req|
        req.headers['Content-Type'] = 'text/xml'
        req.body = body
      end

      Echo::Response.new(response)
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
