# :nodoc:
module ServiceEntryHelper
  def service_entry_tags(service_entry)
    # TagGuids comes back as a hash or nil
    (service_entry['TagGuids'] || {}).fetch('Item', [])
  end

  def tag_guids_for_tag_group(service_entry, tag_group)
    guids = service_entry_tags(service_entry)

    return [] if guids.empty?

    # The first element of the tag strings ARE the tag group. We'll group
    # by that value and return the requested group. This saves a fair amount
    # of logic from having to be copy and pasted sifting out only the guids we
    # need for a particular operation
    Array.wrap(guids).group_by { |guid| guid.split('_', 3).first }[tag_group]
  end

  # Extract only the concept ID from the tag guid which is part of a derived
  # string composed of {TYPE}_{GUID}_{CONCEPT_ID}
  def concept_ids_from_service_entry_tags(service_entry)
    guids = tag_guids_for_tag_group(service_entry, 'DATASET')

    return [] if guids.empty?

    guids.map { |guid| guid.split('_', 3).last }
  end

  # Provided a service entry this will pull out concept ids from tag guids and
  # request the collections from CMR
  def collections_from_service_entry_tags(service_entry)
    concept_ids = concept_ids_from_service_entry_tags(service_entry)

    return [] if concept_ids.empty?

    cmr_client.get_collections(concept_id: concept_ids).body.fetch('items', [])
  end

  # Method to retrieve Service Interface tags for use with Service Implementations.
  def service_interface_tags
    tags_response = echo_client.get_tags_by_tag_group(echo_provider_token, 'SERVICE-INTERFACE')

    if tags_response.success?
      (tags_response.parsed_body['Item'] || []).sort_by { |option| option['Value'].downcase }
    else
      Rails.logger.error "Error retrieving tags for tag group SERVICE-INTERFACE: #{tags_response.error_message}"

      []
    end
  end
end
