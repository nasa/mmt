module Cmr
  # this client connects to the Launchpad Token Service, which under the `api` subdomain, which is a different namespace than the healthcheck and keep alive
  class LaunchpadTokenServiceClient < BaseClient
    def validate_launchpad_token(launchpad_token)
      # this is a post in proposal mode, but it is not writing any data, it is
      # using the Launchpad Service Account credentials to authenticate
      response = launchpad_token_service_connection.post do |req|
        req.url('/icam/api/sm/v1/validate')
        req.headers['Content-Type'] = 'application/json'
        req.body = { 'token' => launchpad_token }.to_json
      end
      puts "lp response: \n#{response.inspect}"
      response
    end

    # def launchpad_token_service_root
    #   if ENV['launchpad_production'] == 'true'
    #     'https://api.launchpad.nasa.gov'
    #   else
    #     'https://api.launchpad-sbx.nasa.gov'
    #   end
    # end

    def launchpad_token_service_connection
      Faraday.new(url: @root, ssl: ssl) do |conn|
      # Faraday.new(url: launchpad_token_service_root, ssl: ssl) do |conn|
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
