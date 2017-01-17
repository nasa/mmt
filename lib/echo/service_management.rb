module Echo
  # The Service Management Service allows for the creation, retrieval, update, and
  # deletion of service entries in ECHO. Service entries are owned by a provider,
  # and are managed by any user with the necessary EXTENDED_SERVICE ACL privileges
  # for that provider.
  class ServiceManagement < Base
    # Gets the names and guids of the service option definitions indicated. If guids
    # is null then all of the service option definition names will be retrieved. If
    # the token is on behalf of a provider then all of the provider's service option
    # definition names will be retrieved.
    def get_service_options_names(token, guids = nil)
      builder = Builder::XmlMarkup.new

      builder.ns2(:GetServiceOptionDefinitionNames, 'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10') do
        builder.ns2(:token, token)

        if guids.nil?
          # Providing nil will return all service options (NOT an empty string, only nil)
          builder.ns2(:optionGuids, 'xsi:nil': true)
        else
          builder.ns2(:optionGuids) do
            Array.wrap(guids).each do |g|
              builder.ns3(:Item, g)
            end
          end
        end
      end

      payload = wrap_with_envelope(builder)

      make_request(@url, payload)
    end

    # Retrieves service option definitions.
    def get_service_options(token, guids = nil)
      builder = Builder::XmlMarkup.new

      builder.ns2(:GetServiceOptionDefinitions, 'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10') do
        builder.ns2(:token, token)

        if guids.nil?
          # Providing nil will return all service options (NOT an empty string, only nil)
          builder.ns2(:optionGuids, 'xsi:nil': true)
        else
          builder.ns2(:optionGuids) do
            Array.wrap(guids).each do |g|
              builder.ns3(:Item, g)
            end
          end
        end
      end

      payload = wrap_with_envelope(builder)

      make_request(@url, payload)
    end

    # Creates new service option definitions.
    def create_service_option(token, payload)
      builder = Builder::XmlMarkup.new

      builder.ns2(:AddServiceOptionDefinitions, 'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10') do
        builder.ns2(:token, token)
        builder.ns2(:serviceOptionDefinitions) do
          builder.ns3(:Item) do
            builder.ns3(:Guid, payload.fetch('Guid')) if payload.key?('Guid')
            builder.ns3(:ProviderGuid, payload.fetch('ProviderGuid')) if payload.key?('ProviderGuid')
            builder.ns3(:Name, payload.fetch('Name')) if payload.key?('Name')
            builder.ns3(:Description, payload.fetch('Description')) if payload.key?('Description')
            builder.ns3(:Form, payload.fetch('Form')) if payload.key?('Form')
          end
        end
      end

      payload = wrap_with_envelope(builder)

      make_request(@url, payload)
    end
  end
end
