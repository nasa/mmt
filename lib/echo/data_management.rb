module Echo
  # The Data Management Service is primarily used by providers to manage the usage of
  # the data in their holdings. It may also be used to manage system options that are
  # then available to all providers.
  class DataManagement < Base
    # Retrieve a data quality summary definition used in describing the quality information
    # associated with one or more catalog items.
    def get_data_quality_summary_definition(token, guid)
      builder = Builder::XmlMarkup.new

      builder.ns2(:GetDataQualitySummaryDefinition, 'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10') do
        builder.ns2(:token, payload_token(token))
        builder.ns2(:guid, guid)
      end

      payload = wrap_with_envelope(builder)

      make_request(@url, payload)
    end

    # Retrieve all data quality summary definitions (used in describing the quality information
    # associated with one or more catalog items) for a given provider.
    def get_data_quality_summary_definition_name_guids(token, provider_guid)
      builder = Builder::XmlMarkup.new

      builder.ns2(:GetDataQualitySummaryDefinitionNameGuids, 'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10') do
        builder.ns2(:token, payload_token(token))
        builder.ns2(:providerGuid, provider_guid)
      end

      payload = wrap_with_envelope(builder)

      make_request(@url, payload)
    end

    # Creates a data quality summary definition for use in describing the quality information
    # associated with one or more catalog items.
    def create_data_quality_summary_definition(token, payload)
      builder = Builder::XmlMarkup.new

      builder.ns2(:CreateDataQualitySummaryDefinition, 'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10') do
        builder.ns2(:token, payload_token(token))
        builder.ns2(:dataQualitySummaryDefinition) do
          builder.ns3(:Summary, payload.fetch('Summary')) if payload.key?('Summary')
          builder.ns3(:Name, payload.fetch('Name')) if payload.key?('Name')
          builder.ns3(:OwnerProviderGuid, payload.fetch('OwnerProviderGuid')) if payload.key?('OwnerProviderGuid')
        end
      end

      payload = wrap_with_envelope(builder)

      make_request(@url, payload)
    end

    # Updates a data quality summary definition for use in describing the quality information
    # associated with one or more catalog items.
    def update_data_quality_summary_definition(token, payload)
      builder = Builder::XmlMarkup.new

      builder.ns2(:UpdateDataQualitySummaryDefinitions, 'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10') do
        builder.ns2(:token, payload_token(token))
        builder.ns2(:dataQualitySummaryDefinitions) do
          builder.ns3(:Item) do
            builder.ns3(:Guid, payload.fetch('Guid')) if payload.key?('Guid')
            builder.ns3(:Summary, payload.fetch('Summary')) if payload.key?('Summary')
            builder.ns3(:Name, payload.fetch('Name')) if payload.key?('Name')
            builder.ns3(:OwnerProviderGuid, payload.fetch('OwnerProviderGuid')) if payload.key?('OwnerProviderGuid')
          end
        end
      end

      payload = wrap_with_envelope(builder)

      make_request(@url, payload)
    end

    # Removes a data quality summary definition for use in describing the quality information associated with one or more catalog items.
    def remove_data_quality_summary_definition(token, guids)
      builder = Builder::XmlMarkup.new

      builder.ns2(:RemoveDataQualitySummaryDefinitions, 'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10') do
        builder.ns2(:token, payload_token(token))

        builder.ns2(:guids) do
          Array.wrap(guids).each do |g|
            builder.ns3(:Item, g)
          end
        end
      end

      payload = wrap_with_envelope(builder)

      make_request(@url, payload)
    end

    # Retrieve all data quality summary assignments for a catalog item.
    def get_data_quality_summary_assignments(token, catalog_item_guid)
      builder = Builder::XmlMarkup.new

      builder.ns2(:GetDataQualitySummaryAssignments, 'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10') do
        builder.ns2(:token, payload_token(token))
        builder.ns2(:catalogItemGuid, catalog_item_guid)
      end

      payload = wrap_with_envelope(builder)

      make_request(@url, payload)
    end

    # Creates a data quality summary assignment between a catalog item and a data quality summary definition.
    def create_data_quality_summary_assignment(token, provider_guid, definition_guid, catalog_item_guid)
      builder = Builder::XmlMarkup.new

      builder.ns2(:CreateDataQualitySummaryAssignment, 'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10') do
        builder.ns2(:token, payload_token(token))
        builder.ns2(:providerGuid, provider_guid)
        builder.ns2(:dataQualitySummaryAssignment) do
          builder.ns3(:DefinitionGuid, definition_guid)
          builder.ns3(:CatalogItemGuid, catalog_item_guid)
        end
      end

      payload = wrap_with_envelope(builder)

      make_request(@url, payload)
    end

    # Removes a data quality summary assignment.
    def remove_data_quality_summary_assignments(token, guids)
      builder = Builder::XmlMarkup.new

      builder.ns2(:RemoveDataQualitySummaryAssignments, 'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10') do
        builder.ns2(:token, payload_token(token))

        builder.ns2(:guids) do
          Array.wrap(guids).each do |g|
            builder.ns3(:Item, g)
          end
        end
      end

      payload = wrap_with_envelope(builder)

      make_request(@url, payload)
    end

    def get_order_options_by_guids(echo_provider_token, guids)
      builder = Builder::XmlMarkup.new
      builder.ns2(:GetCatalogItemOptionDefinitions2, 'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10') do
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

    def get_order_options(echo_provider_token, guids = nil)
      if (guids.nil? || guids.empty?)
        guids_response = get_order_options_names(echo_provider_token)
        guids = Array.wrap(guids_response.parsed_body(parser: 'libxml').fetch('Item', []).map { |option| option['Guid'] })
      end
      order_options = []
      while guids.length > 0
        guids = Array.wrap(guids)
        guids_chunk = guids.pop(50)
        partial_order_option_response = get_order_options_by_guids(echo_provider_token, guids_chunk)
        if partial_order_option_response.success?
          partial_order_options = Array.wrap(partial_order_option_response.parsed_body(parser: 'libxml').fetch('Item', []))
          order_options.concat(partial_order_options)
        else
          Rails.logger.error("Retrieve Order Options Error: #{partial_order_option_response.clean_inspect}") if partial_order_option_response.error?
          return {'Item' => []}
        end
      end
      return {'Item' => order_options}
    end

    # Gets the names and guids of the service option definitions indicated. If guids
    # is null then all of the service option definition names will be retrieved. If
    # the token is on behalf of a provider then all of the provider's service option
    # definition names will be retrieved.
    def get_order_options_names(echo_provider_token, guids = nil)
      builder = Builder::XmlMarkup.new

      builder.ns2(:GetCatalogItemOptionDefinitionNames, 'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10') do
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

    # Deprecates an order so it can be deleted
    def deprecate_order_options(echo_provider_token, guids)
      builder = Builder::XmlMarkup.new

      builder.ns2(:SetCatalogItemOptionDefinitionsDeprecated, 'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10') do
        builder.ns2(:token, echo_provider_token)
        builder.ns2(:optionGuids) do
          Array.wrap(guids).each do |guid|
            builder.ns3(:Item, guid)
          end
        end
      end

      payload = wrap_with_envelope(builder)
      make_request(@url, payload)
    end
  end
end
