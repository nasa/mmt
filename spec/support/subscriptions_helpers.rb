module Helpers
  module SubscriptionHelpers
    def prepare_subscription_permissions(permissions, provider = 'MMT_2')
      group_response = create_group(name: 'Subscription Management in Tests', description: 'Subscription Managment in MMT_2 created in subscription tests', members: ['testuser'])
      permission_response = add_permissions_to_group(group_response['concept_id'], permissions, 'SUBSCRIPTION_MANAGEMENT', provider)

      [group_response['concept_id'], permission_response['concept_id']]
    end
  end
end
