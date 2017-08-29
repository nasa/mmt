module Helpers
  # :nodoc:
  module CollectionAssociationHelper
    def create_variable_collection_association(variable_id, *collection_ids)
      association_response = cmr_client.add_collection_assocations_to_variable(variable_id, collection_ids, 'access_token')

      wait_for_cmr

      association_response.body
    end
  end
end
