# MMT-697, upgrading the UMM schema from v1.2 to v1.6, which had ContactPersons
# and ContactGroups that are associated (and nested under) DataCenters and
# also ContactPersons and ContactGroups not associated with DataCenters so
# nested separately
module CmrMetadataPreview
  module DataContactsHelper
    def draft_all_data_contacts_array(draft)
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

    def get_affiliation(data_contact)
      type = get_contact_type(data_contact)
      if type == 'NonDataCenterContactPerson'
        affiliation = data_contact['ContactPerson']['NonDataCenterAffiliation']
      elsif type == 'NonDataCenterContactGroup'
        affiliation = data_contact['ContactGroup']['NonDataCenterAffiliation']
      elsif type == 'DataCenterContactPerson'
        affiliation = data_contact['ContactPersonDataCenter']['ShortName']
      elsif type == 'DataCenterContactGroup'
        affiliation = data_contact['ContactGroupDataCenter']['ShortName']
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

    def display_value_or_add_popover(value, max_length: 14)
      # If length isnt a concern just return the user provided value
      return value if value.length <= max_length

      # Otherwise use a popover
      capture do
        concat link_to(truncate(value, length: max_length),
                       'javascript:void(0)',
                       class: 'webui-popover-link')
        concat content_tag(:div, value, class: 'webui-popover-content')
      end
    end

    def get_full_name(contact)
      first_name = contact['FirstName']
      last_name = contact['LastName']
      full_name = ''
      if (first_name.present? && last_name.present?)
        full_name = first_name + ' ' + last_name
      elsif (first_name.blank? && last_name.present?)
        full_name = last_name
      elsif (first_name.present? && last_name.blank?)
        full_name = first_name
      end
      return full_name
    end
  end
end
