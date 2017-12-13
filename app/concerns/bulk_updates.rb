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
      task.fetch('request-json-body', {}).each do |key, value|
        value = 'FIND_AND_UPDATE' if value == 'FIND_AND_UPDATE_HOME_PAGE_URL'
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

    Array.wrap(collections_response.body['items']).each do |collection|
      task.fetch('collection-statuses', []).find { |status| status['concept-id'] == collection.fetch('meta', {})['concept-id'] }['collection'] = collection
    end
  end

  def set_science_keyword_facets(concept_ids)
    facets = retrieve_collection_facets(concept_ids)
    raw_science_keyword_facets = facets.find { |facet| facet['field'] == 'science_keywords' }

    @science_keyword_facets = parse_hierarchical_facets(raw_science_keyword_facets, 'category')
  end

  def retrieve_collection_facets(concept_ids)
    response = cmr_client.get_collections_by_post({ concept_id: concept_ids, include_facets: true, hierarchical_facets: true }, token, 'json')
    return [{}] unless response.success?

    hierarchical_facets = response.body.fetch('feed', {}).fetch('facets', {})
  end

  def parse_hierarchical_facets(facets, key, parent = nil, all_keywords = {})
    # we take the hierarchical_facets, and group the values by level in the science
    # keyword hierarchy. sample result structure with just the first 2 levels:
    # { category: [{ value: category_value1, parent: nil }],
    #   topic: [{ value: topic_value1, parent: category_value1 }] }

    if facets.key? key
      facets[key].map do |facet|
        all_keywords[key] ||= []
        all_keywords[key] << { value: facet['value'], parent: parent }

        next_level = facet.fetch('subfields', []).first
        parse_hierarchical_facets(facet, next_level, facet['value'], all_keywords) if next_level
      end
    end

    all_keywords
  end
end
