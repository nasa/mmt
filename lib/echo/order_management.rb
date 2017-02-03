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
    # Only the following provider temporal types can be searched by providers
    #
      # CREATION_DATE
      # SUBMISSION_DATE
      # LAST_UPDATE
    def get_provider_order_guids_by_state_date_and_provider(token, payload)
      builder = Builder::XmlMarkup.new

      builder.ns2(:GetProviderOrderGuidsByStateDateAndProvider, 'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10') do
        builder.ns2(:token, token)
        builder.ns2(:states) do
          Array.wrap(payload.fetch('states')).each do |state|
            builder.ns3(:Item, state)
          end
        end
        builder.ns2(:dateType, payload.fetch('date_type'))
        builder.ns2(:from, payload.fetch('from_date'))
        builder.ns2(:to, payload.fetch('to_date'))
      end

      payload = wrap_with_envelope(builder)

      make_request(@url, payload)
    end

    # Gets orders. This returns orders with the provider orders.
    # The order items are retrieved with separate calls.
    def get_orders(token, order_guids)
      builder = Builder::XmlMarkup.new

      builder.ns2(:GetOrders, 'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10') do
        builder.ns2(:token, token)
        builder.ns2(:orderGuids) do
          Array.wrap(order_guids).each do |guid|
            builder.ns3(:Item, guid)
          end
        end
      end

      payload = wrap_with_envelope(builder)

      make_request(@url, payload)
    end
  end
end
