module Echo
  # The Order Management Service has been designed with input from both the
  # OGC Catalog Interface Implementation Specification 1.0 and from portions
  # of the Catalog Interoperability Protocol (CIP) Specification, Release B.
  # It allows ECHO users and guests to build and submit orders for earth
  # science data from data providers registered in ECHO. Client applications
  # build an order using the Order Management Service in a similar fashion
  # to that of using a shopping cart at typical retail website.
  class OrderManagement < Base
    # Returns all of the provider guids that are in one of the given states and within the given temporal range for the provider being acted as. Only users acting as providers can access this operation.

    # Only the following provider order states can be searched by providers
    #
    # PROCESSING
    # CANCELLING
    # SUBMIT_FAILED
    # SUBMIT_REJECTED
    # CANCELLED
    # CLOSED
    #
    # Only the following provider temporal types can be searched by providers
    #
    # CREATION_DATE
    # SUBMISSION_DATE
    # LAST_UPDATE
    def get_provider_order_guids_by_state_date_and_provider(echo_provider_token, payload)
      builder = Builder::XmlMarkup.new

      builder.ns2(:GetProviderOrderGuidsByStateDateAndProvider, 'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10') do
        builder.ns2(:token, echo_provider_token)
        builder.ns2(:states) do
          Array.wrap(payload['states']).each do |state|
            builder.ns3(:Item, state)
          end
        end
        builder.ns2(:dateType, payload['date_type'])
        builder.ns2(:from, payload['from_date'])
        builder.ns2(:to, payload['to_date'])
      end

      payload = wrap_with_envelope(builder)

      make_request(@url, payload)
    end

    # Gets orders. This returns orders with the provider orders.
    # The order items are retrieved with separate calls.
    def get_orders(echo_provider_token, order_guids)
      builder = Builder::XmlMarkup.new

      builder.ns2(:GetOrders, 'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10') do
        builder.ns2(:token, echo_provider_token)
        builder.ns2(:orderGuids) do
          Array.wrap(order_guids).each do |guid|
            builder.ns3(:Item, guid)
          end
        end
      end

      payload = wrap_with_envelope(builder)

      make_request(@url, payload)
    end

    def get_order_item_names_by_provider_order(echo_provider_token, provider_order_guids)
      builder = Builder::XmlMarkup.new

      builder.ns2(:GetOrderItemNamesByProviderOrder, 'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10') do
        builder.ns2(:token, echo_provider_token)
        builder.ns2(:providerOrderGuids) do
          Array.wrap(provider_order_guids).each do |guid|
            builder.ns3(:Item) do
              builder.ns3(:ProviderGuid, guid['ProviderGuid'])
              builder.ns3(:OrderGuid, guid['OrderGuid'])
            end
          end
        end
      end

      payload = wrap_with_envelope(builder)

      make_request(@url, payload)
    end

    def get_order_items(echo_provider_token, item_guids)
      builder = Builder::XmlMarkup.new

      builder.ns2(:GetOrderItems, 'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10') do
        builder.ns2(:token, echo_provider_token)
        builder.ns2(:orderItemGuids) do
          Array.wrap(item_guids).each do |guid|
            builder.ns3(:Item, guid)
          end
        end
      end

      payload = wrap_with_envelope(builder)

      make_request(@url, payload)
    end

    # Enables a provider to resubmit the user's order on behalf of the user. Re-submission is only allowed
    # for orders in a final state. A status message about the re-submission of an order is automatically
    # generated when re-submission is successful.
    #
    # Only one of orderId or providerTrackingId should be used. If providerTrackingId is non-null, it will
    # be used to find the order. Otherwise the orderId will be used.
    def resubmit_order(echo_provider_token, provider_order_guid)
      builder = Builder::XmlMarkup.new

      builder.ns2(:ResubmitProviderOrder, 'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10') do
        builder.ns2(:token, echo_provider_token)
        builder.ns2(:orderGuid, provider_order_guid)
        builder.ns2(:providerTrackingId, nil)
      end

      payload = wrap_with_envelope(builder)

      make_request(@url, payload)
    end
  end
end
