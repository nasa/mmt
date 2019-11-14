module Cmr
  Faraday.register_middleware(:response,
                              logging: Cmr::ClientMiddleware::LoggingMiddleware,
                              errors: Cmr::ClientMiddleware::ErrorMiddleware,
                              events: Cmr::ClientMiddleware::EventMiddleware)
  class BaseClient
    # include Cmr::QueryTransformations
    include Cmr::Util

    # who cares about this client ID?  As a consequence, do we need to change it
    # to include dmmt?
    CLIENT_ID = 'MMT'.freeze
    NGINX_TIMEOUT = 300

    def connection
      @connection ||= build_connection
    end

    def initialize(root, client_id)
      @root = root
      @client_id = client_id
    end

    # sets the timeout used for faraday connections
    def timeout=(value)
      value = 1 if (value <= 0) # not sure how faraday reacts to timeout values of <= 0
      connection.options[:timeout] = value
    end

    # returns the timeouts used by faraday connections
    def timeout
      connection.options[:timeout]
    end

    protected

    # Token "ABC-1" is created on local cmr start up for Admin user
    # Token "ABC-2" is created on local cmr start up for Typical user
    def token_header(token, use_real = false)
      if (Rails.env.development? || Rails.env.test?) && !use_real
        mock_token = 'ABC-2'

        mock_token = 'ABC-1' if token == 'access_token_admin'

        token.present? ? { 'Echo-Token' => mock_token } : {}
      else
        return {} unless token.present?

        if is_urs_token?(token)
          # passing the URS token to CMR requires the client id
          { 'Echo-Token' => "#{token}:#{@client_id}" }
        else
          { 'Echo-Token' => token }
        end
      end
    end

    def request(method, url, params, body, headers)
      Rails.logger.info "#{self.class} Request #{method} #{url} - Body: #{body} - Time: #{Time.now.to_s(:log_time)}"

      faraday_response = connection.send(method, url, params) do |req|
        unless self.class == UrsClient || self.class == LaunchpadClient
          req.headers['Content-Type'] = 'application/json' unless method == :get
          req.headers['Client-Id'] = CLIENT_ID
          req.headers['Echo-ClientId'] = CLIENT_ID unless self.class == CmrClient
        end

        headers.each do |header, value|
          req.headers[header] = value
        end
        req.body = body unless body.blank?
      end

      client_response = Cmr::Response.new(faraday_response)

      begin
        client_response_headers_for_logs = client_response.headers.dup

        if url.include?('keepalive')
          set_cookie_to_log = client_response_headers_for_logs.fetch('set-cookie', '')

          client_response_headers_for_logs['set-cookie'] = "length: #{set_cookie_to_log.length.round(-2)}; snippet: #{set_cookie_to_log.truncate(60)}"
        end

        Rails.logger.error "#{self.class} Response Error: #{client_response.body.inspect}" if client_response.error?

        Rails.logger.info "#{self.class} Response #{method} #{url} result : Headers: #{client_response_headers_for_logs} - Body Size (bytes): #{client_response.body.to_s.bytesize} - Body md5: #{Digest::MD5.hexdigest(client_response.body.to_s)} - Status: #{client_response.status} - Time: #{Time.now.to_s(:log_time)}"
      rescue => e
        Rails.logger.error "#{self.class} Error: #{e}"
      end

      client_response
    end

    def get(url, params = {}, headers = {})
      request(:get, url, params, nil, headers)
    end

    def delete(url, params = {}, body = nil, headers = {})
      raise NotAllowedError.new(__method__) if Rails.configuration.proposal_mode
      request(:delete, url, params, body, headers)
    end

    def post(url, body, headers = {})
      raise NotAllowedError.new(__method__) if Rails.configuration.proposal_mode
      proposal_mode_safe_post(url, body, headers)
    end

    def proposal_mode_safe_post(url, body, headers = {})
      request(:post, url, nil, body, headers)
    end

    def put(url, body, headers = {})
      raise NotAllowedError.new(__method__) if Rails.configuration.proposal_mode
      request(:put, url, nil, body, headers)
    end

    def build_connection
      Faraday.new(url: @root) do |conn|
        conn.use FaradayMiddleware::FollowRedirects
        conn.response :logging

        conn.use :instrumentation

        conn.response :events, content_type: /\bjson$/
        conn.response :json, content_type: /\bjson$/
        # conn.response :xml, content_type: /\bxml$/
        conn.response :errors, content_type: /\bhtml$/

        # Set timeout to 300s to match nginx timeout
        conn.options[:timeout] = NGINX_TIMEOUT - 10

        conn.adapter Faraday.default_adapter
      end
    end
  end
end
