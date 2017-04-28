# :nodoc:
module BulkUpdates
  extend ActiveSupport::Concern

  def retrieve_bulk_updates
    bulk_updates_list_response = cmr_client.get_bulk_updates(current_user.provider_id, token)

    bulk_updates = if bulk_updates_list_response.success?
                     bulk_updates_list_response.body.fetch('tasks', [])
                   else
                     Rails.logger.error("Error retrieving Bulk Updates Jobs List: #{bulk_updates_list_response.inspect}")
                     []
                   end

    bulk_updates
  end
end
