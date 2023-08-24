# :nodoc:
module ServiceEntryHelper
  # Tags are derived strings separated by '_'. This will
  # return all of the parts it is comprised of
  def service_tag_parts(service_tag_guid)
    service_tag_guid.split('_', 3)
  end

  # Retrieve all the tag guids for a provided service entry and tag group
  def tag_guids_for_tag_group(service_entry, tag_group)
    guids = service_entry['TagGuids']

    return [] if guids.blank?

    # The first element of the tag strings ARE the tag group. We'll group
    # by that value and return the requested group. This saves a fair amount
    # of logic from having to be copy and pasted sifting out only the guids we
    # need for a particular operation
    Array.wrap(guids).group_by { |guid| service_tag_parts(guid).first }[tag_group] || []
  end

  # Extract only the concept ID from the tag guid which is part of a derived
  # string composed of {TYPE}_{GUID}_{CONCEPT_ID}
  def concept_ids_from_service_entry_tags(service_entry)
    guids = tag_guids_for_tag_group(service_entry, 'DATASET')

    return [] if guids.blank?

    guids.map { |guid| service_tag_parts(guid).last }
  end

  # Provided a service entry this will pull out concept ids from tag guids and
  # request the collections from CMR
  def collections_from_service_entry_tags(service_entry)
    concept_ids = concept_ids_from_service_entry_tags(service_entry)

    return [] if concept_ids.blank?

    response = cmr_client.get_collections_by_post({ concept_id: concept_ids, page_size: concept_ids.size }, token)
    if response.success?
      response.body.fetch('items', [])
    else
      []
    end
  end
end
