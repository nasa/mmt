module Echo
  class Provider < Base
    # Returns the names and guids of all the active providers in the system.
    def get_provider_names(token, guids=nil)
      builder = Builder::XmlMarkup.new

      builder.ns2(:GetProviderNames, {'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10'}) do
        builder.ns2(:token, token)

        if guids.nil?
          # Providing nil will return all providers (NOT an empty string, only nil)
          builder.ns2(:guids, {'xsi:nil': true})
        else
          builder.ns2(:guids) do
            guids.each do |g|
              builder.ns3(:Item, g)
            end
          end
        end
      end

      payload = self.wrap_with_envelope(builder)

      self.make_request(@url, payload)
    end

    # Returns the provider policies for the given providers. Only the provider policies that are accessible 
    # to the given token are returned.
    def get_providers_policies(token, guids)
      builder = Builder::XmlMarkup.new

      builder.ns2(:GetProvidersPolicies, {'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10'}) do
        builder.ns2(:token, token)

        builder.ns2(:providerGuids) do
          guids.each do |g|
            builder.ns3(:Item, g)
          end
        end

      end

      payload = self.wrap_with_envelope(builder)

      self.make_request(@url, payload)
    end

    # Sets the provider policies for the given provider. If the provider already has policies established, this 
    # operation will replace those policies. If the SSL certificate is updated, it will be deactivated and ops 
    # will be notified that the certificate needs review and activation.
    # 
    # If the provider does not have policies established yet, the policies given will be set as the policies.
    def set_provider_policies(token, provider_guid, payload)
      builder = Builder::XmlMarkup.new

      builder.ns2(:SetProviderPolicies, {'xmlns:ns2': 'http://echo.nasa.gov/echo/v10', 'xmlns:ns3': 'http://echo.nasa.gov/echo/v10/types', 'xmlns:ns4': 'http://echo.nasa.gov/ingest/v10'}) do
        builder.ns2(:token, token)
        builder.ns2(:providerGuid, provider_guid)
        builder.ns2(:policies) do
          builder.ns3(:EndPoint, payload.fetch(:EndPoint))
          builder.ns3(:RetryAttempts, payload.fetch(:RetryAttempts))
          builder.ns3(:RetryWaitTime, payload.fetch(:RetryWaitTime))
          builder.ns3(:Routing, payload.fetch(:Routing))

          # SslPolicy is required
          builder.ns3(:SslPolicy) do              
            builder.ns3(:SslEnabled, payload.fetch(:SslPolicy, {}).fetch(:SslEnabled, false))
            builder.ns3(:SslCertificate, payload.fetch(:SslPolicy, {}).fetch(:SslCertificate, nil))
          end

          # OrderSupportsDuplicateCatalogItems is required, if not provided in the payload we'll default to false
          builder.ns3(:OrderSupportsDuplicateCatalogItems, payload.fetch(:OrderSupportsDuplicateCatalogItems, false))

          # CollectionsSupportingDuplicateOrderItems must be not set at all, or be a list
          if payload.has_key?(:CollectionsSupportingDuplicateOrderItems) and payload.fetch(:CollectionsSupportingDuplicateOrderItems, []).any?
            builder.ns3(:CollectionsSupportingDuplicateOrderItems) do
              payload.fetch(:CollectionsSupportingDuplicateOrderItems).each do |g|
                builder.ns3(:Item, g)
              end
            end
          end

          # SupportedTransactions is required
          builder.ns3(:SupportedTransactions) do
            payload.fetch(:SupportedTransactions).each do |g|
              builder.ns3(:Item, g)
            end
          end

          builder.ns3(:MaxItemsPerOrder, payload.fetch(:MaxItemsPerOrder)) if payload.has_key?(:MaxItemsPerOrder)
          builder.ns3(:Properties, payload.fetch(:Properties)) if payload.has_key?(:Properties)
          builder.ns3(:OrderingSuspendedUntilDate, payload.fetch(:OrderingSuspendedUntilDate)) if payload.has_key?(:OrderingSuspendedUntilDate)

          builder.ns3(:overrideNotificationEnabled, payload.fetch(:overrideNotificationEnabled))
        end
      end

      payload = self.wrap_with_envelope(builder)

      self.make_request(@url, payload)
    end
  end
end
