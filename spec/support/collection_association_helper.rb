module Helpers
  # :nodoc:
  module CollectionAssociationHelper
    def create_service_collection_association(service_id, *collection_ids)
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::CollectionAssociationHelper#create_service_collection_association' do
        association_response = cmr_client.add_collection_assocations_to_service(service_id, collection_ids, 'access_token')

        wait_for_cmr

        return association_response.body
      end
    end

    def create_tool_collection_association(tool_id, *collection_ids)
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::CollectionAssociationHelper#create_tool_collection_association' do
        association_response = cmr_client.add_collection_assocations_to_tool(tool_id, collection_ids, 'access_token')

        wait_for_cmr

        return association_response.body
      end
    end
  end
end
