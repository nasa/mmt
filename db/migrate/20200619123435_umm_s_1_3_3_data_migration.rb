class UmmS133DataMigration < ActiveRecord::Migration[5.2]
  def up
    drafts = ServiceDraft.where.not(draft: {})

    drafts.each do |draft|
      metadata = convert_reformatting_outputs_1_3_1(draft.draft)
      metadata = up_capitalize_license_url(metadata)
      metadata = service_contacts_add_online_resources(metadata)
      draft.draft = remove_url_fields(metadata)

      draft.save
    end
  end

  def down
    drafts = ServiceDraft.where.not(draft: {})

    drafts.each do |draft|
      metadata = convert_reformatting_outputs_1_3_0(draft.draft)
      metadata = down_capitalize_license_url(metadata)
      metadata = service_contacts_add_related_urls(metadata)
      metadata = add_url_fields(metadata)
      draft.draft = remove_new_format_enums(metadata)

      draft.save
    end
  end

  # 1.3.1 changed Reformattings from 1 => 1 to 1 => many inputs to outputs
  # Since we are skipping 1.3.1, we need to account for this change here
  def convert_reformatting_outputs_1_3_1(draft)
    return draft unless (reformattings = draft.fetch('ServiceOptions', {}).fetch('SupportedReformattings', nil))

    reformattings.each do |reformatting|
      next unless reformatting['SupportedOutputFormat']

      reformatting['SupportedOutputFormats'] = [reformatting.delete('SupportedOutputFormat')]
    end

    draft['ServiceOptions']['SupportedReformattings'] = reformattings
    draft
  end

  # Convert 1 => X reformattings into X 1 => 1 reformattings
  def convert_reformatting_outputs_1_3_0(draft)
    return draft unless (reformattings = draft.fetch('ServiceOptions', {}).fetch('SupportedReformattings', nil))

    invalid_formats = ["Shapefile", "GEOJSON", "COG", "WKT"]
    new_reformattings = []
    reformattings.each do |reformatting|
      outputs = reformatting['SupportedOutputFormats']&.reject { |output| invalid_formats.include?(output) }
      input = reformatting['SupportedInputFormat'] unless invalid_formats.include?(reformatting['SupportedInputFormat'])
      next unless input || outputs.present?

      # Cover empty output case
      if input && outputs.blank?
        new_reformattings.push('SupportedInputFormat' => reformatting['SupportedInputFormat'])
        next
      end

      # Make a new reformatting for each output
      outputs.each do |output|
        # Do not migrate the new formats backwards
        next if invalid_formats.include?(output)

        new_reformatting = { 'SupportedOutputFormat' => output }
        new_reformatting['SupportedInputFormat'] = input if input
        new_reformattings.push(new_reformatting)
      end
    end

    draft['ServiceOptions']['SupportedReformattings'] = new_reformattings
    draft
  end

  # UseConstraints::LicenseUrl => UseConstraints::LicenseURL
  def up_capitalize_license_url(draft)
    return draft unless draft.fetch('UseConstraints', {}).fetch('LicenseUrl', nil)

    draft['UseConstraints']['LicenseURL'] = draft['UseConstraints'].delete('LicenseUrl')
    draft
  end

  # UseConstraints::LicenseURL => UseConstraints::LicenseUrl
  def down_capitalize_license_url(draft)
    return draft unless draft.fetch('UseConstraints', {}).fetch('LicenseURL', nil)

    draft['UseConstraints']['LicenseUrl'] = draft['UseConstraints'].delete('LicenseURL')
    draft
  end

  # 1.3.2 removed the typeing fields from URL top level field
  def remove_url_fields(draft)
    return draft unless draft['URL']

    draft['URL'].delete('URLContentType')
    draft['URL'].delete('Type')
    draft['URL'].delete('Subtype')

    draft
  end

  # Can add back some of the type information when reverting to 1.3.0
  def add_url_fields(draft)
    return draft unless draft['URL']

    draft['URL']['URLContentType'] = 'DistributionURL'
    draft['URL']['Type'] = 'GET SERVICE'

    draft
  end

  # 1.3.2 converted RelatedURLs to OnlineResources inside service contacts
  def service_contacts_add_online_resources(draft)
    return draft unless draft['ContactGroups'] || draft['ContactPersons']

    draft['ContactGroups'] = convert_related_urls_to_online_resources(draft['ContactGroups']) if draft['ContactGroups']
    draft['ContactPersons'] = convert_related_urls_to_online_resources(draft['ContactPersons']) if draft['ContactPersons']

    draft
  end

  def service_contacts_add_related_urls(draft)
    return draft unless draft['ContactGroups'] || draft['ContactPersons']

    draft['ContactGroups'] = convert_online_resources_to_related_urls(draft['ContactGroups']) if draft['ContactGroups']
    draft['ContactPersons'] = convert_online_resources_to_related_urls(draft['ContactPersons']) if draft['ContactPersons']

    draft
  end

  def convert_related_urls_to_online_resources(service_contacts)
    service_contacts.each do |contact|
      next unless (related_urls = contact.fetch('ContactInformation', {}).delete('RelatedUrls'))

      online_resources = []
      related_urls.each do |url|
        online_resources.push({
          'Linkage' => url['URL'],
          'Name' => url['Type'],
          'Description' => url['Description']
        })
      end
      contact['ContactInformation']['OnlineResources'] = online_resources
    end
    service_contacts
  end

  def convert_online_resources_to_related_urls(service_contacts)
    service_contacts.each do |contact|
      next unless (online_resources = contact.fetch('ContactInformation', {}).delete('OnlineResources'))

      related_urls = []
      online_resources.each do |resource|
        # URLContentType and Type reverted in the same way that CMR reverted
        related_urls.push(
          {
            'Description' => resource['Description'],
            'URL' => resource['Linkage'],
            'URLContentType' => 'CollectionURL',
            'Type' => 'PROJECT HOME PAGE'
          })
      end
      contact['ContactInformation']['RelatedUrls'] = related_urls
    end
    service_contacts
  end

  # 1.3.3 added new enum values. Remove them for 1.3.0
  def remove_new_format_enums(draft)
    return draft unless draft.fetch('ServiceOptions', {}).fetch('SupportedInputFormats', nil) || draft.fetch('ServiceOptions', {}).fetch('SupportedOutputFormats', nil)

    invalid_formats = ["Shapefile", "GEOJSON", "COG", "WKT"]
    draft['ServiceOptions'].fetch('SupportedInputFormats', []).delete_if { |value| invalid_formats.include?(value) }
    draft['ServiceOptions'].fetch('SupportedOutputFormats', []).delete_if { |value| invalid_formats.include?(value) }
    draft
  end
end
