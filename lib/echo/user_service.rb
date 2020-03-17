module Echo
  # Provides access to user related functionality such as locating and updating users.

  class UserService < Base
    # Returns the user ID and guids for users based on the given guids. This operation requires a registered user.
    def get_user_names(echo_provider_token, user_guids)
      builder = Builder::XmlMarkup.new

      builder.ns2(:GetUserNames, 'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10') do
        builder.ns2(:token, echo_provider_token)
        builder.ns2(:userGuids) do
          Array.wrap(user_guids).each do |guid|
            builder.ns3(:Item, guid)
          end
        end
      end

      payload = wrap_with_envelope(builder)

      make_request(@url, payload)
    end
  end
end
