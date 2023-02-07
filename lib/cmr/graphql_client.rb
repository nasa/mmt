module Cmr
  class GraphqlClient < BaseClient
    def send_request(token, query)
      url = '/ordering/api'
      headers = { 'Content-Type' => 'application/json' }
      headers = headers.merge(authorization_header(token))
      puts("########## query=#{query.to_json}")
      post(url, query.to_json, headers)
    end

    def get_provider_policy(token, provider_id)
      variables = {}
      variables['providerId'] = provider_id
      query = {}
      query['variables'] = variables
      query['query'] = "query ProviderPolicy($providerId: String!) {
                          providerPolicy(providerId: $providerId) {
                            id
                            providerId
                            endpoint
                            retryAttempts
                            retryWaitTime
                            orderingSuspendedUntilDate
                            maxItemsPerOrder
                            overrideNotifyEnabled
                            referenceProps
                            sslPolicy {
                              id
                              sslEnabled
                              sslCertificate
                              updatedAt
                            }
                            createdAt
                            updatedAt
                          }
                        }"
      send_request(token, query)
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
      sslPolicy['sslCertificate'] = sslPolicy['sslCertificate'].gsub(/\r\n/, "\n")
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
      send_request(token, query)
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
      sslPolicy['sslCertificate'] = sslPolicy['sslCertificate'].gsub(/\r\n/, "\n")
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
      send_request(token, query)
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
      send_request(token, query)
    end

    def remove_provider_policy(token, provider_id)
      variables = {}
      variables['providerId'] = provider_id
      query = {}
      query['variables'] = variables
      query['query'] = "mutation DeleteProviderPolicy($providerId: String!) {
                          deleteProviderPolicy(providerId: $providerId)
                        }"
      send_request(token, query)
    end

    def get_order(token, order_id)
      variables = {}
      variables['id'] = order_id
      query = {}
      query['variables'] = variables
      query['query'] = "query Order ($id: String!) {
                          order (id: $id) {
                            id
                            clientIdentity
                            collectionConceptId
                            notificationLevel
                            providerId
                            providerTrackingId
                            state
                            closedDate
                            submittedAt
                            createdAt
                            updatedAt
                            orderItems {
                              id
                              granuleConceptId
                              granuleUr
                              producerGranuleId
                            }
                            user {
                              id
                              ursId
                            }
                            contact {
                              id
                              email
                              firstName
                              lastName
                              userDomain
                              userRegion
                            }
                          }
                        }"
      send_request(token, query)
    end

    def get_orders(token, provider_id, payload)
      variables = {}
      query = {}
      query['variables'] = variables
      variables['ursId'] = payload['ursId']
      variables['providerId'] = provider_id
      variables['states'] = payload['states']
      date_range = {}
      date_range['startDate'] = payload['startDate']
      date_range['endDate'] = payload['endDate']
      date_type_hash = {}
      date_type_hash['CREATION_DATE'] = 'createdAt'
      date_type_hash['SUBMISSION_DATE'] = 'submittedAt'
      date_type_hash['LAST_UPDATE_DATE'] = 'updatedAt'
      date_type = date_type_hash[payload['dateType']]
      variables[date_type] = date_range
      query['query'] = "query Order (
                          $providerId: String!
                          $ursId: String
                          $states: [OrderState]
                          $place_holder_date_type: DateRangeInput
                       ) {
                         orders(
                           providerId: $providerId
                           ursId: $ursId
                           states: $states
                           place_holder_date_type: $place_holder_date_type
                         ) {
                           id
                           clientIdentity
                           collectionConceptId
                           notificationLevel
                           providerId
                           providerTrackingId
                           state
                           closedDate
                           submittedAt
                           createdAt
                           updatedAt
                           user {
                             ursId
                           }
                           contact {
                             id
                             email
                             firstName
                             lastName
                             userDomain
                             userRegion
                           }
                         }
                       }"
      query['query'] = query['query'].gsub('place_holder_date_type', date_type)
      send_request(token, query)
    end

    def resubmit_order(token, order_id)
      variables = {}
      variables['id'] = order_id
      query = {}
      query['variables'] = variables
      query['query'] = "mutation ResubmitOrder($id: String!) {
                          resubmitOrder(id: $id) {
                            id
                            state
                          }
                        }"
      send_request(token, query)
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
                            id
                            state
                          }
                        }"
      send_request(token, query)
    end

  end
end
