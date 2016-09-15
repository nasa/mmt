module DataContactsHelper
  TEST = [1, 2, 3]

  # def draft_data_contacts_unnested(draft)
  #   data_contacts = []
  #
  #   if draft['ContactPersons']
  #     data_contacts << {'NonDataCenterContactPersons' => draft['ContactPersons']}
  #   end
  #   if draft['ContactGroups']
  #     data_contacts << {'NonDataCenterContactGroups' => draft['ContactGroups']}
  #   end
  #
  #   if draft['DataCenters']
  #     data_centers = draft['DataCenters']
  #     data_centers.each do |data_center|
  #       if data_center['ContactPersons']
  #         data_contacts['DataCenterContactPersons'] ||= []
  #         data_contacts['DataCenterContactPersons'] += data_center['ContactPersons']
  #       end
  #       if data_center['ContactGroups']
  #         data_contacts['DataCenterContactGroups'] ||= []
  #         data_contacts['DataCenterContactGroups'] += data_center['ContactGroups']
  #       end
  #     end
  #   end
  #
  #   data_contacts
  # end

  # def draft_data_contacts_nested(draft)
  #   data_contacts = []
  #
  #   # TODO need to separate out contact persons and groups?
  #   if draft['ContactPersons']
  #     data_contacts << { 'ContactPersons' => draft['ContactPersons'] }
  #   end
  #   if draft['ContactGroups']
  #     data_contacts << { 'ContactGroups' => draft['ContactGroups'] }
  #   end
  #
  #   if draft['DataCenters']
  #     data_centers = draft['DataCenters']
  #     data_centers_with_contacts = [] # {} or []
  #     data_centers.each do |data_center|
  #       # do we need to test that short_name has been chosen?
  #       if data_center['ContactPersons'] || data_center['ContactGroups']
  #         data_centers_with_contacts << data_center
  #       end
  #       if data_center['ContactPersons'] || data_center['ContactGroups']
  #         data_centers_with_contacts << data_center
  #       end
  #       # need to test and flatten
  #     end
  #     if data_centers_with_contacts.count > 0
  #       data_contacts << { 'DataCenters' => data_centers_with_contacts }
  #     end
  #   end
  #
  #   data_contacts
  # end

  def draft_data_contacts_flat(draft)
    data_contacts = []

    if draft['ContactPersons']
      draft['ContactPersons'].each do |contact_person|
        data_contacts << { 'ContactPerson' => contact_person }
      end
    end
    if draft['ContactGroups']
      draft['ContactGroups'].each do |contact_group|
        data_contacts << { 'ContactGroup' => contact_group }
      end
    end

    if draft['DataCenters']
      data_centers_with_contacts = []
      draft['DataCenters'].each do |data_center|
        if data_center['ContactPersons']
          data_center['ContactPersons'].each do |contact_person|
            contact_person_data_center = { 'ShortName' => data_center['ShortName'],
                                           'LongName' => data_center['LongName'],
                                           'ContactPerson' => contact_person }
            data_contacts << { 'ContactPersonDataCenter' => contact_person_data_center }
          end
        end
        if data_center['ContactGroups']
          data_center['ContactGroups'].each do |contact_group|
            contact_group_data_center = { 'ShortName' => data_center['ShortName'],
                                          'LongName' => data_center['LongName'],
                                          'ContactGroup' => contact_group }
            data_contacts << { 'ContactGroupDataCenter' => contact_group_data_center }
          end
        end
      end
    end
    data_contacts.empty? ? nil : data_contacts
  end

  def get_contact_type(data_contact)
    if data_contact.keys.include?('ContactPerson')
      'NonDataCenterContactPerson'
    elsif data_contact.keys.include?('ContactGroup')
      'NonDataCenterContactGroup'
    elsif data_contact.keys.include?('ContactPersonDataCenter')
      'DataCenterContactPerson'
    elsif data_contact.keys.include?('ContactGroupDataCenter')
      'DataCenterContactGroup'
    end
  end

  def get_person(data_contact)
    if data_contact['ContactPerson']
      person = data_contact['ContactPerson']
    else
      person = data_contact['ContactPersonDataCenter']['ContactPerson']
    end
  end

  def get_group(data_contact)
    if data_contact['ContactGroup']
      group = data_contact['ContactGroup']
    else
      group = data_contact['ContactGroupDataCenter']['ContactGroup']
    end
  end

  def get_data_center_names(data_contact)
    if data_contact['ContactPersonDataCenter']
      data_center = { 'ShortName' => data_contact['ContactPersonDataCenter']['ShortName'],
                      'LongName' => data_contact['ContactPersonDataCenter']['LongName'] }
    else
      data_center = { 'ShortName' => data_contact['ContactGroupDataCenter']['ShortName'],
                      'LongName' => data_contact['ContactGroupDataCenter']['LongName'] }
    end
  end

  def contact_person_first_name(data_contact)

  end

  def contact_person_last_name(data_contact)

  end

  def contact_group_name(data_contact)

  end

  # most of these helper methods have to do with ___, upgrading the UMM schema from
  # v1.2 to v1.6, which had ContactPersons and ContactGroups that are associated
  # (and nested under) DataCenters and also ContactPersons and ContactGroups
  # not associated with DataCenters so nested separately

  # def has_any_data_contacts?(metadata)
  #   has_contacts?(metadata) || has_data_center_contacts?(metadata) ? true : false
  # end

  # def has_data_center_contacts?(draft)
  #   return false unless draft['DataCenters']
  #   data_centers = draft['DataCenters']
  #   data_centers.each do |data_center|
  #     # return true if !data_center['ContactPersons'].empty? || !data_center['ContactGroups'].empty?
  #     return true if has_contacts?(data_center)
  #   end
  #   false
  # end

  # def has_non_data_center_contacts?(metadata)
  #   metadata['ContactPersons'].empty? && metadata['ContactGroups'].empty? ? false : true
  # end

  # def has_contacts?(metadata)
  #   metadata['ContactPersons'] || metadata['ContactGroups'] ? true : false
  # end

  def has_data_contacts?(metadata)
    draft_data_contacts_flat(metadata).blank? ? false : true
  end


end
