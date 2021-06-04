module Echo
  # The Service Management Service allows for the creation, retrieval, update, and
  # deletion of service entries in ECHO. Service entries are owned by a provider,
  # and are managed by any user with the necessary EXTENDED_SERVICE ACL privileges
  # for that provider.
  class ServiceManagement < Base
    # Returns the service tags associated with a list of tag guids.
    # NOTE: To be used when CMR-3793 is completed.
    def get_tags(token, tag_guids)
      builder = Builder::XmlMarkup.new

      builder.ns2(:GetTags, 'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10') do
        builder.ns2(:token, payload_token(token))
        builder.ns2(:tagGuids) do
          Array.wrap(tag_guids).each do |g|
            builder.ns3(:Item, g)
          end
        end
      end

      payload = wrap_with_envelope(builder)

      make_request(@url, payload)
    end

    # Returns the service tags associated with a tag group.
    def get_tags_by_tag_group(echo_provider_token, tag_guid)
      builder = Builder::XmlMarkup.new

      builder.ns2(:GetTagsByTagGroup, 'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10') do
        builder.ns2(:token, echo_provider_token)
        builder.ns2(:tagGroupGuid, tag_guid)
      end

      payload = wrap_with_envelope(builder)

      make_request(@url, payload)
    end
    # Retrieves service entries.
    def get_service_entries(echo_provider_token, guids = null)
      builder = Builder::XmlMarkup.new
      builder.ns2(:GetServiceEntries, 'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10') do
        builder.ns2(:token, echo_provider_token)
        if guids.nil?
          # Providing nil will return all service options (NOT an empty string, only nil)
          builder.ns2(:serviceEntryGuids, 'xsi:nil': true)
        else
          builder.ns2(:serviceEntryGuids) do
            Array.wrap(guids).each do |g|
              builder.ns3(:Item, g)
            end
          end
        end
      end

      payload = wrap_with_envelope(builder)

      make_request(@url, payload)
    end

    # Get the listing of all services associated with the given providers.
    def get_service_entries_by_provider(echo_provider_token, provider_guids)
      builder = Builder::XmlMarkup.new

      builder.ns2(:GetServiceEntriesByProvider, 'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10') do
        builder.ns2(:token, echo_provider_token)
        builder.ns2(:providerGuids) do
          Array.wrap(provider_guids).each do |g|
            builder.ns3(:Item, g)
          end
        end
      end

      payload = wrap_with_envelope(builder)

      make_request(@url, payload)
    end

    # Creates a new service entry.
    def create_service_entry(echo_provider_token, payload)
      builder = Builder::XmlMarkup.new

      builder.ns2(:CreateServiceEntry, 'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10') do
        builder.ns2(:token, echo_provider_token)
        builder.ns2(:serviceEntry) do
          builder.ns3(:Guid, payload.fetch('Guid')) if payload.key?('Guid')
          builder.ns3(:ProviderGuid, payload.fetch('ProviderGuid')) if payload.key?('ProviderGuid')
          builder.ns3(:Name, payload.fetch('Name')) if payload.key?('Name')
          builder.ns3(:Url, payload.fetch('Url')) if payload.key?('Url')
          builder.ns3(:Description, payload.fetch('Description')) if payload.key?('Description')
          builder.ns3(:EntryType, payload.fetch('EntryType')) if payload.key?('EntryType')

          if payload.key?('TagGuids') && payload.fetch('TagGuids', []).any?
            builder.ns3(:TagGuids) do
              Array.wrap(payload.fetch('TagGuids', [])).each do |g|
                builder.ns3(:Item, g)
              end
            end
          end
        end
      end

      payload = wrap_with_envelope(builder)

      make_request(@url, payload)
    end

    # Updates existing service entries.
    def update_service_entry(echo_provider_token, payload)
      builder = Builder::XmlMarkup.new

      builder.ns2(:UpdateServiceEntries, 'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10') do
        builder.ns2(:token, echo_provider_token)
        builder.ns2(:serviceEntries) do
          builder.ns3(:Item) do
            builder.ns3(:Guid, payload.fetch('Guid')) if payload.key?('Guid')
            builder.ns3(:ProviderGuid, payload.fetch('ProviderGuid')) if payload.key?('ProviderGuid')
            builder.ns3(:Name, payload.fetch('Name')) if payload.key?('Name')
            builder.ns3(:Url, payload.fetch('Url')) if payload.key?('Url')
            builder.ns3(:Description, payload.fetch('Description')) if payload.key?('Description')
            builder.ns3(:EntryType, payload.fetch('EntryType')) if payload.key?('EntryType')

            if payload.key?('TagGuids') && payload.fetch('TagGuids', []).any?
              builder.ns3(:TagGuids) do
                Array.wrap(payload.fetch('TagGuids', [])).each do |g|
                  builder.ns3(:Item, g)
                end
              end
            end
          end
        end
      end

      payload = wrap_with_envelope(builder)

      make_request(@url, payload)
    end

    # Removes service entries.
    def remove_service_entry(echo_provider_token, guids)
      builder = Builder::XmlMarkup.new

      builder.ns2(:RemoveServiceEntries, 'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10') do
        builder.ns2(:token, echo_provider_token)

        builder.ns2(:serviceEntryGuids) do
          Array.wrap(guids).each do |g|
            builder.ns3(:Item, g)
          end
        end
      end

      payload = wrap_with_envelope(builder)

      make_request(@url, payload)
    end

    # Gets the names and guids of the service option definitions indicated. If guids
    # is null then all of the service option definition names will be retrieved. If
    # the token is on behalf of a provider then all of the provider's service option
    # definition names will be retrieved.
    def get_service_options_names(echo_provider_token, guids = nil)
      builder = Builder::XmlMarkup.new

      builder.ns2(:GetServiceOptionDefinitionNames, 'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10') do
        builder.ns2(:token, echo_provider_token)

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

    # Retrieves service option definitions by given guids
    def get_service_options_by_guids(echo_provider_token, guids)
      builder = Builder::XmlMarkup.new
      builder.ns2(:GetServiceOptionDefinitions, 'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10') do
        builder.ns2(:token, echo_provider_token)
        builder.ns2(:optionGuids) do
          Array.wrap(guids).each do |g|
            builder.ns3(:Item, g)
          end
        end
      end
      payload = wrap_with_envelope(builder)
      make_request(@url, payload)
    end

    # Retrieves service option definitions.
    def get_service_options(echo_provider_token, guids = nil)
      if (guids.nil? || guids.empty?)
        guids_response = get_service_options_names(echo_provider_token)
        guids = guids_response.success? ? Array.wrap(guids_response.parsed_body(parser: 'libxml').fetch('Item', []).map { |option| option['Guid'] }) : []
      end
      service_options = []
      while guids.length > 0
        guids = Array.wrap(guids)
        guids_chunk = guids.pop(50)
        partial_service_option_response = get_service_options_by_guids(echo_provider_token, guids_chunk)
        if partial_service_option_response.success?
          partial_service_options = Array.wrap(partial_service_option_response.parsed_body(parser: 'libxml').fetch('Item', []))
          service_options.concat(partial_service_options)
        else
          Rails.logger.error("Retrieve Service Options Error: #{partial_service_option_response.clean_inspect}") if partial_service_option_response.error?
          return {'Item' => []}
        end
      end
      return {'Item' => service_options}
    end

    # Creates new service option definitions.
    def create_service_option(echo_provider_token, payload)
      builder = Builder::XmlMarkup.new

      builder.ns2(:AddServiceOptionDefinitions, 'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10') do
        builder.ns2(:token, echo_provider_token)
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

    # Updates existing service option definitions.
    def update_service_option(token, payload)
      builder = Builder::XmlMarkup.new

      builder.ns2(:UpdateServiceOptionDefinitions, 'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10') do
        builder.ns2(:token, payload_token(token))
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

    # Removes existing service option definitions.
    def remove_service_option(token, guids)
      builder = Builder::XmlMarkup.new

      builder.ns2(:RemoveServiceOptionDefinitions, 'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10') do
        builder.ns2(:token, payload_token(token))

        builder.ns2(:optionGuids) do
          Array.wrap(guids).each do |g|
            builder.ns3(:Item, g)
          end
        end
      end

      payload = wrap_with_envelope(builder)

      make_request(@url, payload)
    end

    # Retrieves service option assignments associated with a service.
    def get_service_option_assignments_by_service(echo_provider_token, service_guids)
      builder = Builder::XmlMarkup.new

      builder.ns2(:GetServiceOptionAssignmentsByService, 'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10') do
        builder.ns2(:token, echo_provider_token)
        builder.ns2(:serviceEntryGuids) do
          Array.wrap(service_guids).each do |g|
            builder.ns3(:Item, g)
          end
        end
      end

      payload = wrap_with_envelope(builder)

      make_request(@url, payload)
    end

    # Creates new service option assignment.
    def create_service_option_assignments(echo_provider_token, assignments)
      builder = Builder::XmlMarkup.new

      builder.ns2(:AddServiceOptionAssignments, 'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10') do
        builder.ns2(:token, echo_provider_token)

        builder.ns2(:serviceOptionAssignments) do
          Array.wrap(assignments).each do |assignment|
            builder.ns3(:Item) do
              builder.ns3(:ServiceOptionDefinitionGuid, assignment.fetch('ServiceOptionDefinitionGuid')) if assignment.key?('ServiceOptionDefinitionGuid')
              builder.ns3(:ServiceEntryGuid, assignment.fetch('ServiceEntryGuid')) if assignment.key?('ServiceEntryGuid')
              builder.ns3(:CatalogItemGuid, assignment.fetch('CatalogItemGuid')) if assignment.key?('CatalogItemGuid')
              builder.ns3(:AppliesOnlyToGranules, assignment.fetch('AppliesOnlyToGranules')) if assignment.key?('AppliesOnlyToGranules')
            end
          end
        end
      end

      payload = wrap_with_envelope(builder)

      make_request(@url, payload)
    end

    # Removes existing service option assignments.
    def remove_service_option_assignments(echo_provider_token, guids)
      builder = Builder::XmlMarkup.new

      builder.ns2(:RemoveServiceOptionAssignments, 'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10') do
        builder.ns2(:token, echo_provider_token)

        builder.ns2(:optionGuids) do
          Array.wrap(guids).each do |g|
            builder.ns3(:Item, g)
          end
        end
      end

      payload = wrap_with_envelope(builder)

      make_request(@url, payload)
    end
  end
end
