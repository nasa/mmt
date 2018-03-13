module Helpers
  # :nodoc:
  module CollectionAssociationHelper
    def create_variable_collection_association(variable_id, *collection_ids)
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::CollectionAssociationHelper#create_variable_collection_association' do
        association_response = cmr_client.add_collection_assocations_to_variable(variable_id, collection_ids, 'access_token')

        wait_for_cmr

        return association_response.body
      end
    end

    def create_service_collection_association(service_id, *collection_ids)
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::CollectionAssociationHelper#create_service_collection_association' do
        association_response = cmr_client.add_collection_assocations_to_service(service_id, collection_ids, 'access_token')

        wait_for_cmr

        return association_response.body
      end
    end
  end
end
