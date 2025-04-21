module Cmr
  # this client connects to the Launchpad Token Service, which under the `api` subdomain, which is a different namespace than the healthcheck and keep alive
  class LaunchpadTokenServiceClient < BaseClient
    def validate_launchpad_token(launchpad_token)
      # this is a post in proposal mode, but it is not writing any data, it is
      # using the Launchpad Service Account credentials to authenticate
      faraday_response = launchpad_token_service_connection.post do |req|
        req.url('/icam/api/sm/v1/validate')
        req.headers['Content-Type'] = 'application/json'
        req.body = { 'token' => launchpad_token }.to_json
      end

      client_response = Cmr::Response.new(faraday_response)

      begin
        client_response_headers_for_logs = client_response.headers.dup

        if client_response.error?
          Rails.logger.error "#{self.class} Response Error: #{client_response.body.inspect}"
        end

        Rails.logger.info "#{self.class} Response post #{faraday_response.env.url} result : Headers: #{client_response_headers_for_logs} - Body Size (bytes): #{client_response.body.to_s.bytesize} - Body md5: #{Digest::MD5.hexdigest(client_response.body.to_s)} - Status: #{client_response.status} - Time: #{Time.now.to_fs(:log_time)}"
      rescue => e
        Rails.logger.error "#{self.class} Error: #{e}"
      end

      client_response
    end

    def launchpad_token_service_connection
      Faraday.new(url: @root, ssl: ssl) do |conn|
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

    def ssl
      {
        client_key: client_key,
        client_cert: client_cert
      }
    end

    def client_key
      p12.key
    end

    def client_cert
      p12.certificate
    end

    def p12
      OpenSSL::PKCS12.new(p12_file, service_account_cert_key)
    end

    def p12_file
      if Rails.env.development? || Rails.env.test?
        File.binread(File.join(Rails.root, 'lib', 'assets', 'certs', 'serviceaccount.pfx'))
      else
        File.binread(File.join('config', 'serviceaccount.pfx'))
      end
    end

    def service_account_cert_key
      ENV['service_account_cert_key']
    end
  end
end
