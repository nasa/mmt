module Echo
  # Provides operations to allow data providers take action (accept or reject)
  # a user's request on an order, such as submit, quote, and cancel order.
  # This service also allows providers to take actions to the order directly,
  # such as cancelling and closing an order or updating an order status
  # message.
  class OrderProcessing < Base
    # Enables a provider to accept the user's request for cancelling order.
    # The provider can also use this transaction directly to cancel an order in
    # process. The provider may supply a status message about this order. This
    # operation also allows a provider to cancel specific order line items. If
    # all order line items are cancelled, the whole provider order will be
    # automatically cancelled.
    def accept_provider_order_cancellation(echo_provider_token, order_guid, provider_tracking_id, catalog_items, status_message)
      builder = Builder::XmlMarkup.new

      builder.ns2(:AcceptProviderOrderCancellation, 'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10') do
        builder.ns2(:token, echo_provider_token)
        builder.ns2(:orderGuid, order_guid)
        builder.ns2(:providerTrackingId, provider_tracking_id)
        builder.ns2(:catalogItemGuids) do
          Array.wrap(catalog_items).each do |guid|
            builder.ns3(:Item, guid)
          end
        end
        builder.ns2(:statusMessage, status_message)
      end

      payload = wrap_with_envelope(builder)

      make_request(@url, payload)
    end

    # Allows a provider to close a provider order. It also allows a provider
    # to close specific order line items. If all the order line items are
    # closed, the whole provider order will be automatically closed.
    def close_provider_order(echo_provider_token, order_guid, provider_tracking_id, catalog_items, status_message)
      builder = Builder::XmlMarkup.new

      builder.ns2(:CloseProviderOrder, 'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10') do
        builder.ns2(:token, echo_provider_token)
        builder.ns2(:orderGuid, order_guid)
        builder.ns2(:providerTrackingId, provider_tracking_id)
        builder.ns2(:catalogItemGuids) do
          Array.wrap(catalog_items).each do |guid|
            builder.ns3(:Item, guid)
          end
        end
        builder.ns2(:statusMessage, status_message)
      end

      payload = wrap_with_envelope(builder)

      make_request(@url, payload)
    end
  end
end
