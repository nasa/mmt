class UmmSchema18To19RelatedUrl < ActiveRecord::Migration[4.2]
  def up
    Draft.find_each do |d|
      draft = d.draft
      puts "Draft: #{d.id}"
      migrate_related_urls(draft.fetch('RelatedUrls', []))
      migrate_data_centers(draft.fetch('DataCenters', []))
      migrate_groups_or_persons(draft.fetch('ContactGroups', []))
      migrate_groups_or_persons(draft.fetch('ContactPersons', []))

      d.draft = draft
      d.save
    end
  end

  def migrate_related_urls(related_urls)
    related_urls.each do |related_url|
      urls_to_url(related_url)

      relation_to_url_content_type(related_url)

      migrate_to_get_data(related_url)
      migrate_to_get_service(related_url)

      # Remove old fields
      related_url.delete('FileSize')
      related_url.delete('MimeType')
    end
  end

  def urls_to_url(related_url)
    related_url['URL'] = related_url.fetch('URLs', []).first

    related_url.delete('URLs')
  end

  def relation_to_url_content_type(related_url)
    relation = related_url.fetch('Relation', [])
    if relation.empty?
      related_url['URLContentType'] = 'PublicationURL'
      related_url['Type'] = 'VIEW RELATED INFORMATION'
      related_url['Subtype'] = 'GENERAL DOCUMENTATION'
    else
      DraftsHelper::URLContentTypeMap.each do |url_content_type, types|
        next unless types.keys.include? relation[0]
        type = relation[0]
        subtype = relation[1] if types[type].include? relation[1]
        related_url['URLContentType'] = url_content_type
        related_url['Type'] = type
        related_url['Subtype'] = subtype
        break
      end
    end

    related_url.delete('Relation')
  end

  def migrate_to_get_data(related_url)
    return unless related_url['URLContentType'] == 'DistributionURL' && related_url['Type'] == 'GET DATA'

    file_size = related_url.fetch('FileSize', {})

    get_data = {}
    get_data['Size'] = file_size['Size'] if file_size['Size']
    get_data['Unit'] = file_size['Unit'] if file_size['Unit']
    related_url['GetData'] = get_data
  end

  def migrate_to_get_service(related_url)
    return unless related_url['URLContentType'] == 'DistributionURL' && related_url['Type'] == 'GET SERVICE'

    get_service = {}
    get_service['MimeType'] = related_url['MimeType'] if related_url['MimeType']

    related_url['GetService'] = get_service
  end

  def migrate_data_centers(data_centers)
    data_centers.each do |data_center|
      migrate_groups_or_persons(data_center.fetch('ContactGroups', []))

      migrate_groups_or_persons(data_center.fetch('ContactPersons', []))

      migrate_contact_information(data_center)
    end
  end

  def migrate_groups_or_persons(metadata)
    metadata.each do |m|
      migrate_contact_information(m)
    end
  end

  def migrate_contact_information(metadata)
    contact_information = metadata.fetch('ContactInformation', {})
    related_urls = contact_information.fetch('RelatedUrls', [])

    related_urls.each do |related_url|
      urls_to_url(related_url)
      related_url['URLContentType'] = 'DataContactURL'
      related_url['Type'] = 'HOME PAGE'

      related_url.delete('Relation')
      related_url.delete('GetData')
      related_url.delete('GetService')
      related_url.delete('FileSize')
      related_url.delete('MimeType')
    end
  end
end
