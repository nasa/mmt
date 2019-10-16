class UmmSchema13To14 < ActiveRecord::Migration[4.2]
  def up
    Draft.find_each do |d|
      draft = d.draft

      if draft && draft.key?('Organizations')
        # Organizations to DataCenters unless DataCenters already exists
        if draft.key?('DataCenters')
          draft.delete('Organizations')
        else
          organizations = draft.delete('Organizations')
          data_centers = []

          organizations.each do |organization|
            data_center = {}
            data_center['Role'] = organization['Role'] if organization.key?('Role')

            party = organization.fetch('Party', {})
            if party.key?('OrganizationName')
              data_center['ShortName'] = party['OrganizationName']['ShortName'] if party['OrganizationName'].key?('ShortName')
              data_center['LongName'] = party['OrganizationName']['LongName'] if party['OrganizationName'].key?('LongName')
            end

            contact_information = {}
            contact_information['ServiceHours'] = party['ServiceHours'] if party.key?('ServiceHours')
            contact_information['ContactInstruction'] = party['ContactInstructions'] if party.key?('ContactInstructions')
            contact_information['RelatedUrls'] = party['RelatedUrls'] if party.key?('RelatedUrls')
            contact_information['Addresses'] = party['Addresses'] if party.key?('Addresses')
            contact_information['ContactMechanisms'] = party['Contacts'] if party.key?('Contacts')

            data_center['ContactInformation'] = Array.wrap(contact_information)
            data_centers << data_center
          end

          draft['DataCenters'] = data_centers
        end
      end

      if draft && draft.key?('Personnel')
        # Personnel to ContactPersons unless DataCenters already exists
        if draft.key?('ContactPersons')
          draft.delete('Personnel')
        else
          personnel = draft.delete('Personnel')

          contact_persons = []
          personnel.each do |person|
            contact_person = {}
            contact_person['Role'] = person['Role'] if person.key?('Role')

            person_type = person.fetch('Person', {})
            contact_person['FirstName'] = person_type['FirstName'] if person_type.key?('FirstName')
            contact_person['MiddleName'] = person_type['MiddleName'] if person_type.key?('MiddleName')
            contact_person['LastName'] = person_type['LastName'] if person_type.key?('LastName')

            party = person.fetch('Party', {})
            contact_information = {}
            contact_information['ServiceHours'] = party['ServiceHours'] if party.key?('ServiceHours')
            contact_information['ContactInstruction'] = party['ContactInstructions'] if party.key?('ContactInstructions')
            contact_information['RelatedUrls'] = party['RelatedUrls'] if party.key?('RelatedUrls')
            contact_information['Addresses'] = party['Addresses'] if party.key?('Addresses')
            contact_information['ContactMechanisms'] = party['Contacts'] if party.key?('Contacts')

            contact_person['ContactInformation'] = Array.wrap(contact_information)
            contact_persons << contact_person
          end
          draft['ContactPersons'] = contact_persons
        end
      end

      d.draft = draft
      d.save
    end
  end

  def down
    Draft.find_each do |d|
      draft = d.draft

      if draft && draft.key?('DataCenters')
        # DataCenters to Organizations
        data_centers = draft.delete('DataCenters')

        organizations = []

        data_centers.each do |data_center|
          organization = {}
          organization['Role'] = data_center['Role'] if data_center.key?('Role')

          party = {}
          organization_name = {}
          organization_name['ShortName'] = data_center['ShortName'] if data_center.key?('ShortName')
          organization_name['LongName'] = data_center['LongName'] if data_center.key?('LongName')
          party['OrganizationName'] = organization_name

          contact_information = Array.wrap(data_center.fetch('ContactInformation', [{}])).first
          party['ServiceHours'] = contact_information['ServiceHours'] if contact_information.key?('ServiceHours')
          party['ContactInstructions'] = contact_information['ContactInstruction'] if contact_information.key?('ContactInstruction')
          party['RelatedUrls'] = contact_information['RelatedUrls'] if contact_information.key?('RelatedUrls')
          party['Addresses'] = contact_information['Addresses'] if contact_information.key?('Addresses')
          party['Contacts'] = contact_information['ContactMechanisms'] if contact_information.key?('ContactMechanisms')

          organization['Party'] = party
          organizations << organization
        end

        draft['DataCenters'] = data_centers
      end

      if draft && draft.key?('ContactPersons')
        # ContactPersons to Personnel
        contact_persons = draft.delete('ContactPersons')

        personnel = []
        contact_persons.each do |contact_person|
          person = {}
          person['Role'] = contact_person['Role'] if contact_person.key?('Role')

          person_type = {}
          person_type['FirstName'] = contact_person['FirstName'] if contact_person.key?('FirstName')
          person_type['MiddleName'] = contact_person['MiddleName'] if contact_person.key?('MiddleName')
          person_type['LastName'] = contact_person['LastName'] if contact_person.key?('LastName')

          party = {}
          contact_information = Array.wrap(contact_person.fetch('ContactInformation', [{}])).first
          party['ServiceHours'] = contact_information['ServiceHours'] if contact_information.key?('ServiceHours')
          party['ContactInstructions'] = contact_information['ContactInstruction'] if contact_information.key?('ContactInstruction')
          party['RelatedUrls'] = contact_information['RelatedUrls'] if contact_information.key?('RelatedUrls')
          party['Addresses'] = contact_information['Addresses'] if contact_information.key?('Addresses')
          party['Contacts'] = contact_information['ContactMechanisms'] if contact_information.key?('ContactMechanisms')

          person['Party'] = party
          personnel << person
        end

        draft['Personnel'] = personnel
      end

      d.draft = draft
      d.save
    end
  end
end
