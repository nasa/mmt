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

    bulk_updates.each { |update| hydrate_task(update) }

    bulk_updates.sort_by { |option| option['task-id'] }
  end

  # When the bulk update task comes back from CMR it needs a bit of
  # massaging before its ready for the view
  def hydrate_task(task, flatten_keys: true)
    task['request-json-body'] = JSON.parse(task['request-json-body'])

    if flatten_keys
      # Pull out all of the keys from the originial
      # request object and insert them into the root
      task['request-json-body'].each do |key, value|
        task[key] = value
      end
    end
  end

  # The response from CMR only includes the concept-id
  # but for display purposes we need detailed information
  def hydrate_collections(task)
    concept_ids = task.fetch('collection-statuses', []).map { |status| status['concept-id'] }
    return unless concept_ids.any?

    collections_response = cmr_client.get_collections_by_post({ concept_id: concept_ids, page_size: concept_ids.count }, token)
    return unless collections_response.success?

    collections_response.body['items'].each do |collection|
      task.fetch('collection-statuses', []).find { |status| status['concept-id'] == collection.fetch('meta', {})['concept-id'] }['collection'] = collection
    end
  end
end
