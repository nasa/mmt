module Helpers
  module SubscriptionHelpers
    def publish_new_subscription(name: nil, collection_concept_id: nil, query: nil, subscriber_id: nil, email_address: nil, provider: 'MMT_2', native_id: nil, revision: 1)
      random = SecureRandom.uuid
      subscription = {
        'Name' => name || "Test_Subscription_#{random}",
        'CollectionConceptId' => collection_concept_id || 'C0000-TEST',
        'Query' => query || 'field=Test_Query',
        'SubscriberId' => subscriber_id || 'rarxd5taqea',
        'EmailAddress' => email_address || 'fake@fake.fake'
      }

      ingest_response = cmr_client.ingest_subscription(subscription.to_json, provider, native_id || "mmt_subscription_#{random}", 'token')

      raise Array.wrap(ingest_response.body['errors']).join(' /// ') unless ingest_response.success?

      wait_for_cmr

      # TODO: Add the concept response like the draft helpers have when we have
      # a read endpoint.

      [ingest_response.parsed_body['result'], subscription]
    end
  end
end