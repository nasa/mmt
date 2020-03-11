module Echo
  class Authentication < Base
    # Gets an ECHO Token. A new token is created and returned each time this method is invoked.
    #
    # After 5 failed attempts, the account is locked for 60 seconds. The account is locked again
    # after each subsequent failed attempt until a successful login.
    def login(username, password, params)
      builder = Builder::XmlMarkup.new

      builder.ns2(:Login, {'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10'}) do
        builder.ns2(:username, username)
        builder.ns2(:password, password)

        builder.ns2(:clientInfo) do
          builder.ns3(:ClientId, params.fetch(:clientInfo, {}).fetch(:ClientId, 'MMT'))
          builder.ns3(:UserIpAddress, params.fetch(:clientInfo, {}).fetch(:UserIpAddress, nil))
        end

        builder.ns2(:actAsUserName, params.fetch(:actAsUserName, nil))
        builder.ns2(:behalfOfProvider, params.fetch(:behalfOfProvider, nil))
      end

      payload = self.wrap_with_envelope(builder)

      self.make_request(@url, payload)
    end

    def get_provider_context_token(token, params)
      builder = Builder::XmlMarkup.new

      builder.ns2(:GetProviderContextToken, {'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10'}) do
        builder.ns2(:token, payload_token(token))

        builder.ns2(:clientInfo) do
          builder.ns3(:ClientId, params.fetch(:clientInfo, {}).fetch(:ClientId, 'MMT'))
          builder.ns3(:UserIpAddress, params.fetch(:clientInfo, {}).fetch(:UserIpAddress, nil))
        end

        builder.ns2(:behalfOfProvider, params.fetch(:behalfOfProvider, nil))
      end

      payload = self.wrap_with_envelope(builder)

      self.make_request(@url, payload)
    end

  end
end
