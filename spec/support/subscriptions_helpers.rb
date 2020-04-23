module Helpers
  module SubscriptionHelpers
    def publish_new_subscription(name: nil, collection_concept_id: nil, query: nil, subscriber_id: nil, email_address: nil, provider: 'MMT_2', native_id: nil, revision: 1)
      random = SecureRandom.uuid
      subscription = {
        'Name' => name || "Test_Subscription_#{random}",
        'CollectionConceptId' => collection_concept_id || "C#{Faker::Number.number(digits: 6)}-TEST",
        'Query' => query || 'bounding_box=-10,-5,10,5&attribute\[\]=float,PERCENTAGE,25.5,30',
        'SubscriberId' => subscriber_id || 'rarxd5taqea',
        'EmailAddress' => email_address || 'uozydogeyyyujukey@tjbh.eyyy'
      }

      ingest_response = cmr_client.ingest_subscription(subscription.to_json, provider, native_id || "mmt_subscription_#{random}", 'token')

      raise Array.wrap(ingest_response.body['errors']).join(' /// ') unless ingest_response.success?

      wait_for_cmr

      search_response = cmr_client.get_subscriptions({ 'ConceptId' => ingest_response.parsed_body['result']['concept_id'] }, 'token')

      raise Array.wrap(search_response.body['errors']).join(' /// ') unless search_response.success?

      [ingest_response.parsed_body['result'], search_response, subscription]
    end

    def prepare_subscription_permissions(permissions, provider = 'MMT_2')
      group_response = create_group(name: 'Subscription Management in Tests', description: 'Subscription Managment in MMT_2 created in subscription tests', members: ['testuser'])
      permission_response = add_permissions_to_group(group_response['concept_id'], permissions, 'EMAIL_SUBSCRIPTION_MANAGEMENT', provider)

      [group_response['concept_id'], permission_response['concept_id']]
    end
  end
end
