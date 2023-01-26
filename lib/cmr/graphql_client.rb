module Cmr
  class GraphqlClient < BaseClient
    def get_provider_policy(token, provider_id)
      variables = {}
      variables['providerId'] = provider_id
      query = {}
      query['variables'] = variables
      query['query'] = "query ProviderPolicy($providerId: String!) {
                          providerPolicy(providerId: $providerId) {
                            id,
                            providerId,
                            endpoint,
                            retryAttempts,
                            retryWaitTime,
                            orderingSuspendedUntilDate,
                            maxItemsPerOrder,
                            overrideNotifyEnabled,
                            referenceProps,
                            sslPolicy {
                              id,
                              sslEnabled,
                              sslCertificate,
                              updatedAt
                            }
                            createdAt,
                            updatedAt
                          }
                        }"
      url = '/ordering/api'
      headers = { 'Content-Type' => 'application/json' }
      headers = headers.merge(authorization_header(token))
      post(url, query.to_json, headers)
    end

    def create_provider_policy(token, provider_id, payload)
      variables = {}
      variables['providerId'] = provider_id
      variables['endpoint'] = payload[:endpoint]
      variables['retryAttempts'] = payload[:retryAttempts]
      unless variables['retryAttempts'].nil?
        variables['retryAttempts'] = variables['retryAttempts'].to_i
      end
      variables['retryWaitTime'] = payload[:retryWaitTime]
      unless variables['retryWaitTime'].nil?
        variables['retryWaitTime'] = variables['retryWaitTime'].to_i
      end
      variables['maxItemsPerOrder'] = payload[:maxItemsPerOrder]
      unless variables['maxItemsPerOrder'].nil?
        variables['maxItemsPerOrder'] = variables['maxItemsPerOrder'].to_i
      end
      variables['orderingSuspendedUntilDate'] = payload[:orderingSuspendedUntilDate]
      variables['overrideNotifyEnabled'] = payload[:overrideNotifyEnabled] == '1' ? true : false
      variables['referenceProps'] = payload[:referenceProps]
      sslPolicy = {}
      sslPolicy['sslEnabled'] = payload[:sslPolicy][:sslEnabled] == '1' ? true : false
      sslPolicy['sslCertificate'] = payload[:sslPolicy][:sslCertificate]
      variables['sslPolicy'] = sslPolicy
      query = {}
      query['variables'] = variables
      query['query'] = "mutation CreateProviderPolicy(
                          $providerId: String!
                          $endpoint: String!
                          $retryAttempts: Int!
                          $retryWaitTime: Int!
                          $orderingSuspendedUntilDate: Timestamp
                          $maxItemsPerOrder: Int
                          $overrideNotifyEnabled: Boolean
                          $referenceProps: String
                          $sslPolicy: SslPolicyInput!
                        ) {
                            createProviderPolicy(
                              endpoint: $endpoint
                              providerId: $providerId
                              retryAttempts: $retryAttempts
                              retryWaitTime: $retryWaitTime
                              orderingSuspendedUntilDate: $orderingSuspendedUntilDate
                              maxItemsPerOrder: $maxItemsPerOrder
                              overrideNotifyEnabled: $overrideNotifyEnabled
                              referenceProps: $referenceProps
                              sslPolicy: $sslPolicy
                          ) {
                            id
                          }
                        }"
      url = '/ordering/api'
      headers = { 'Content-Type' => 'application/json' }
      headers = headers.merge(authorization_header(token))
      post(url, query.to_json, headers)
    end

    def update_provider_policy(token, provider_id, payload)
      variables = {}
      variables['providerId'] = provider_id
      variables['endpoint'] = payload[:endpoint]
      variables['retryAttempts'] = payload[:retryAttempts]
      unless variables['retryAttempts'].nil?
        variables['retryAttempts'] = variables['retryAttempts'].to_i
      end
      variables['retryWaitTime'] = payload[:retryWaitTime]
      unless variables['retryWaitTime'].nil?
        variables['retryWaitTime'] = variables['retryWaitTime'].to_i
      end
      variables['maxItemsPerOrder'] = payload[:maxItemsPerOrder]
      unless variables['maxItemsPerOrder'].nil?
        variables['maxItemsPerOrder'] = variables['maxItemsPerOrder'].to_i
      end
      variables['orderingSuspendedUntilDate'] = payload[:orderingSuspendedUntilDate]
      variables['overrideNotifyEnabled'] = payload[:overrideNotifyEnabled] == '1' ? true : false
      variables['referenceProps'] = payload[:referenceProps]
      sslPolicy = {}
      sslPolicy['sslEnabled'] = payload[:sslPolicy][:sslEnabled] == '1' ? true : false
      sslPolicy['sslCertificate'] = payload[:sslPolicy][:sslCertificate]
      variables['sslPolicy'] = sslPolicy
      query = {}
      query['variables'] = variables
      query['query'] = "mutation UpdateProviderPolicy(
                          $providerId: String!
                          $endpoint: String!
                          $retryAttempts: Int!
                          $retryWaitTime: Int!
                          $orderingSuspendedUntilDate: Timestamp
                          $maxItemsPerOrder: Int
                          $overrideNotifyEnabled: Boolean
                          $referenceProps: String
                          $sslPolicy: SslPolicyInput!
                        ) {
                            updateProviderPolicy(
                              endpoint: $endpoint
                              providerId: $providerId
                              retryAttempts: $retryAttempts
                              retryWaitTime: $retryWaitTime
                              orderingSuspendedUntilDate: $orderingSuspendedUntilDate
                              maxItemsPerOrder: $maxItemsPerOrder
                              overrideNotifyEnabled: $overrideNotifyEnabled
                              referenceProps: $referenceProps
                              sslPolicy: $sslPolicy
                          ) {
                            id
                          }
                        }"
      url = '/ordering/api'
      headers = { 'Content-Type' => 'application/json' }
      headers = headers.merge(authorization_header(token))
      post(url, query.to_json, headers)
    end

    def test_endpoint_connection(token, provider_id)
      variables = {}
      variables['providerId'] = provider_id
      query = {}
      query['variables'] = variables
      query['query'] = "mutation TestProviderConnection($providerId: String!) {
                          testProviderConnection(providerId: $providerId) {
                            status
                          }
                        }"
      url = '/ordering/api'
      headers = { 'Content-Type' => 'application/json' }
      headers = headers.merge(authorization_header(token))
      post(url, query.to_json, headers)
    end

    def remove_provider_policy(token, provider_id)
      variables = {}
      variables['providerId'] = provider_id
      query = {}
      query['variables'] = variables
      query['query'] = "mutation DeleteProviderPolicy($providerId: String!) {
                          deleteProviderPolicy(providerId: $providerId)
                        }"
      url = '/ordering/api'
      headers = { 'Content-Type' => 'application/json' }
      headers = headers.merge(authorization_header(token))
      post(url, query.to_json, headers)
    end
  end
end