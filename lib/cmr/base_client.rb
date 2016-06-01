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

    def token_header(token, use_real = false)
      if (Rails.env.development? || Rails.env.test?) && !use_real
        mock_token = 'ABC-2'
        if Rails.env.test? && token == 'access_token_admin'
          mock_token = 'ABC-1'
        end
        token.present? ? { 'Echo-Token' => mock_token } : {}
      else
        token.present? ? { 'Echo-Token' => "#{token}:#{@client_id}" } : {}
      end
    end

    def system_token_header
      { 'Echo-Token' => ENV['system_token'] }
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
      Cmr::Response.new(faraday_response)
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

        conn.response :events, content_type: /\bjson$/
        conn.response :json, content_type: /\bjson$/
        # conn.response :xml, content_type: /\bxml$/
        conn.response :errors, content_type: /\bhtml$/

        conn.adapter Faraday.default_adapter
      end
    end
  end
end
