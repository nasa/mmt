module Cmr
  Faraday.register_middleware(:response,
                              logging: Cmr::ClientMiddleware::LoggingMiddleware,
                              errors: Cmr::ClientMiddleware::ErrorMiddleware,
                              events: Cmr::ClientMiddleware::EventMiddleware)
  class BaseClient
    # include Cmr::QueryTransformations
    CLIENT_ID = 'MMT'

    def connection
      @connection ||= build_connection
    end

    def initialize(root, client_id)
      @root = root
      @client_id = client_id
    end

    protected

    # ABC-1: Admin
    # ABC-2: Typical
    def token_header(token, use_real = false)
      if (Rails.env.development? || Rails.env.test?) && !use_real
        mock_token = 'ABC-2'

        mock_token = 'ABC-1' if token == 'access_token_admin'

        token.present? ? { 'Echo-Token' => mock_token } : {}
      else
        token.present? ? { 'Echo-Token' => "#{token}:#{@client_id}" } : {}
      end
    end

    def request(method, url, params, body, headers)
      faraday_response = connection.send(method, url, params) do |req|
        req.headers['Content-Type'] = 'application/json' unless method == :get
        req.headers['Client-Id'] = CLIENT_ID
        req.headers['Echo-ClientId'] = CLIENT_ID unless self.class == CmrClient
        headers.each do |header, value|
          req.headers[header] = value
        end
        req.body = body if body
      end
      Rails.logger.info "CMR Request #{method} #{url} body: #{body}"
      client_response = Cmr::Response.new(faraday_response)
      begin
        Rails.logger.info "CMR Response #{method} #{url} result : Headers: #{client_response.headers} - Body Size (bytes): #{client_response.body.to_s.bytesize} Status: #{client_response.status}"
      rescue => e
        Rails.logger.error e
      end

      # TODO delete this - this is what I was using to test and make sure we were not getting 500 errors from modifying the response body
      # if url.include?('keywords')
      # if url.include?('concepts')
      # if url.include?('variable') #|| url.include?('concepts')
      # if url.include?('collections') #|| url.include?('concepts')
      # if url.include?('members')
      # if url.include?('groups')
      #   client_response.content_type = 'text/html'
      #   client_response.status = 500
      #   client_response.body = "<html>\r\n<head><title>500 Internal Server Error</title></head>\r\n<body bgcolor=\"white\">\r\n<center><h1>500 Internal Server Error</h1></center>\r\n errors error <hr><center>nginx/1.12.2</center>\r\n</body>\r\n</html>\r\n"
      # end


      # if client_response.error? && client_response.body.is_a?(String)
      if client_response.error? && client_response.headers['content-type'] == 'text/html'
        # if the response body is an HTML document, there is something pretty wrong
        # happening log the response, and transform it
        Rails.logger.error "CMR Error Response Body is a HTML document: #{client_response.body}"
        client_response.body = { 'errors' => 'There was an error with the operation you were trying to perform. There may be an issue with one of the services we depend on. Please contact your provider administrator or the CMR OPS team.' }
      end

      client_response
    end

    def get(url, params = {}, headers = {})
      request(:get, url, params, nil, headers)
    end

    def delete(url, params = {}, body = nil, headers = {})
      request(:delete, url, params, body, headers)
    end

    def post(url, body, headers = {})
      request(:post, url, nil, body, headers)
    end

    def put(url, body, headers = {})
      request(:put, url, nil, body, headers)
    end

    def build_connection
      Faraday.new(url: @root) do |conn|
        conn.response :logging

        conn.use :instrumentation

        conn.response :events, content_type: /\bjson$/
        conn.response :json, content_type: /\bjson$/
        # conn.response :xml, content_type: /\bxml$/
        conn.response :errors, content_type: /\bhtml$/

        conn.adapter Faraday.default_adapter
      end
    end

    def valid_uri?(uri)
      !!URI.parse(uri)
    rescue URI::InvalidURIError
      false
    end

    def encode_if_needed(url_fragment)
      valid_uri?(url_fragment) ? url_fragment : URI.encode(url_fragment)
    end
  end
end
