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

    def get_order(token, order_id)
      variables = {}
      variables['id'] = order_id
      query = {}
      query['variables'] = variables
      query['query'] = "query Order ($id: String!) {
                          order (id: $id) {
                            id,
                            clientIdentity,
                            collectionConceptId,
                            notificationLevel,
                            optionSelection,
                            providerId,
                            providerTrackingId,
                            state,
                            closedDate,
                            submittedAt,
                            createdAt,
                            updatedAt,
                            orderItems,
                            orderRetry,
                            statusMessages,
                            user,
                            contact
                          }
                        }"
      url = '/ordering/api'
      headers = { 'Content-Type' => 'application/json' }
      headers = headers.merge(authorization_header(token))
      post(url, query.to_json, headers)
    end

    def get_orders(token, provider_id, payload)
      variables = {}
      variables['id'] = order_id
      query = {}
      query['variables'] = variables
      variables['providerId'] = provider_id
      variables['state'] = payload[:state]
      variables['submittedAt'] = payload[:submittedAt]
      variables['createdAt'] = payload[:createdAt]
      variables['updatedAt'] = payload[:updatedAt]
      variables['ursId'] = payload[:ursId]
      query['query'] = "query Order (
                          $providerId: String!
                          $state: String
                          $submittedAt: DateRangeInput
                          $createdAt: DateRangeInput
                          $updatedAt: DateRangeInput
                          $ursId: String
                        ) {
                          orders(
                            providerId: $providerId
                            state: $state
                            submittedAt: $submittedAt
                            createdAt: $createdAt
                            updatedAt: $updatedAt
                            ursId: $ursId
                          ) {
                            id,
                            clientIdentity,
                            collectionConceptId,
                            notificationLevel,
                            optionSelection,
                            providerId,
                            providerTrackingId,
                            state,
                            closedDate,
                            submittedAt,
                            createdAt,
                            updatedAt,
                            orderItems,
                            orderRetry,
                            statusMessages,
                            user,
                            contact
                          }
                        }"
      url = '/ordering/api'
      headers = { 'Content-Type' => 'application/json' }
      headers = headers.merge(authorization_header(token))
      post(url, query.to_json, headers)
    end

    def resubmit_order(token, order_id)
      variables = {}
      variables['id'] = order_id
      query = {}
      query['variables'] = variables
      query['query'] = "mutation ResubmitOrder($id: String!) {
                          resubmitOrder(id: $id) {
                            state
                          }
                        }"
      url = '/ordering/api'
      headers = { 'Content-Type' => 'application/json' }
      headers = headers.merge(authorization_header(token))
      post(url, query.to_json, headers)
    end

    def close_order(token, order_id, message)
      variables = {}
      variables['id'] = order_id
      variables['message'] = message
      query = {}
      query['variables'] = variables
      query['query'] = "mutation CloseOrder(
                          $id: String!
                          $message: String!
                        ) {
                          closeOrder (
                            id: $id
                            message: $message
                          ) {
                            id,
                            state
                          }
                        }"
      url = '/ordering/api'
      headers = { 'Content-Type' => 'application/json' }
      headers = headers.merge(authorization_header(token))
      post(url, query.to_json, headers)
    end

  end
end
