module Echo
  class Base
    NGINX_TIMEOUT = 50

    def initialize(url, wsdl)
      @url = url
      @wsdl = wsdl
    end

    def connection
      @connection ||= build_connection
    end

    def build_connection
      Faraday.new(url: @url) do |conn|
        conn.use FaradayMiddleware::FollowRedirects
        conn.use :instrumentation

        # Set timeout to 300s to match nginx timeout
        conn.options[:timeout] = NGINX_TIMEOUT

        conn.adapter Faraday.default_adapter
      end
    end

    def make_request(url, body)
      parsed_body = Hash.send('from_xml', body).fetch('Envelope', {}).fetch('Body', {})

      Rails.logger.info("SOAP call: URL: #{url} - Params: #{parsed_body.keys.first}: #{parsed_body[parsed_body.keys.first].except('xmlns:ns2', 'xmlns:ns3', 'xmlns:ns4', 'token').inspect} - Time: #{Time.now.to_s(:log_time)}")

      connection.options[:timeout] = @@timeout_remaining
      puts "setting timeout to #{timeout}"

      response = connection.post do |req|
        req.headers['Content-Type'] = 'text/xml'
        req.body = body
      end

      echo_response = Echo::Response.new(response)
      begin

        Rails.logger.error "SOAP Response Error: #{echo_response.body.inspect}" if echo_response.error?

        Rails.logger.info "SOAP Response: #{url} result : Headers: #{echo_response.headers} - Body Size (bytes): #{echo_response.body.to_s.bytesize} - Body md5: #{Digest::MD5.hexdigest(echo_response.body.to_s)} - Status: #{echo_response.status} - Time: #{Time.now.to_s(:log_time)}"
      rescue => e
        Rails.logger.error "SOAP Error: #{e}"
      end

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

    def timeout=(value)
      value = 1 if (value <= 0) # not sure how faraday reacts to timeout values of <= 0
      @@timeout_remaining = value
    end

    def timeout
      !defined?(@@timeout_remaining) ? return NGINX_TIMEOUT : return @@timeout_remaining
    end

  end
end
