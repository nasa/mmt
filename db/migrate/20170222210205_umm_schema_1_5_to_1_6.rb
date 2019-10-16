class UmmSchema15To16 < ActiveRecord::Migration[4.2]
  def up
    Draft.find_each do |d|
      draft = d.draft

      # ContactInformation changes from an array to a single object
      # DataCenterType/ContactInformation
      # ContactGroupType/ContactInformation
      # ContactPersonType/ContactInformation
      if draft && draft.key?('DataCenters')
        data_centers = draft.delete('DataCenters')

        new_data_centers = []
        data_centers.each do |data_center|
          data_center['ContactInformation'] = Array.wrap(data_center['ContactInformation']).first if data_center.key?('ContactInformation')

          if data_center.key?('ContactPersons')
            contact_persons = data_center.fetch('ContactPersons', [{}])
            new_contact_persons = []
            contact_persons.each do |person|
              person['ContactInformation'] = Array.wrap(person['ContactInformation']).first if person.key?('ContactInformation')
              new_contact_persons << person
            end
            data_center['ContactPersons'] = new_contact_persons unless new_contact_persons.empty?
          end

          if data_center.key?('ContactGroups')
            contact_groups = data_center.fetch('ContactGroups', [{}])
            new_contact_groups = []
            contact_groups.each do |group|
              group['ContactInformation'] = Array.wrap(group['ContactInformation']).first if group.key?('ContactInformation')
              new_contact_groups << group
            end
            data_center['ContactGroups'] = new_contact_groups unless new_contact_groups.empty?
          end

          new_data_centers << data_center
        end

        draft['DataCenters'] = new_data_centers
      end

      if draft && draft.key?('ContactPersons')
        contact_persons = draft.fetch('ContactPersons', [{}])
        new_contact_persons = []
        contact_persons.each do |person|
          person['ContactInformation'] = Array.wrap(person['ContactInformation']).first if person.key?('ContactInformation')
          new_contact_persons << person
        end
        draft['ContactPersons'] = new_contact_persons unless new_contact_persons.empty?
      end

      if draft && draft.key?('ContactGroups')
        contact_groups = draft.fetch('ContactGroups', [{}])
        new_contact_groups = []
        contact_groups.each do |group|
          group['ContactInformation'] = Array.wrap(group['ContactInformation']).first if group.key?('ContactInformation')
          new_contact_groups << group
        end
        draft['ContactGroups'] = new_contact_groups unless new_contact_groups.empty?
      end

      d.draft = draft
      d.save
    end
  end

  def down
    Draft.find_each do |d|
      draft = d.draft

      if draft && draft.key?('DataCenters')
        data_centers = draft.delete('DataCenters')

        new_data_centers = []
        data_centers.each do |data_center|
          data_center['ContactInformation'] = Array.wrap(data_center['ContactInformation']) if data_center.key?('ContactInformation')

          if data_center.key?('ContactPersons')
            contact_persons = data_center.fetch('ContactPersons', [{}])
            new_contact_persons = []
            contact_persons.each do |person|
              person['ContactInformation'] = Array.wrap(person['ContactInformation']) if person.key?('ContactInformation')
              new_contact_persons << person
            end
            data_center['ContactPersons'] = new_contact_persons unless new_contact_persons.empty?
          end

          if data_center.key?('ContactGroups')
            contact_groups = data_center.fetch('ContactGroups', [{}])
            new_contact_groups = []
            contact_groups.each do |group|
              group['ContactInformation'] = Array.wrap(group['ContactInformation']) if group.key?('ContactInformation')
              new_contact_groups << group
            end
            data_center['ContactGroups'] = new_contact_groups unless new_contact_groups.empty?
          end

          new_data_centers << data_center
        end

        draft['DataCenters'] = new_data_centers
      end

      if draft && draft.key?('ContactPersons')
        contact_persons = draft.fetch('ContactPersons', [{}])
        new_contact_persons = []
        contact_persons.each do |person|
          person['ContactInformation'] = Array.wrap(person['ContactInformation']) if person.key?('ContactInformation')
          new_contact_persons << person
        end
        draft['ContactPersons'] = new_contact_persons unless new_contact_persons.empty?
      end

      if draft && draft.key?('ContactGroups')
        contact_groups = draft.fetch('ContactGroups', [{}])
        new_contact_groups = []
        contact_groups.each do |group|
          group['ContactInformation'] = Array.wrap(group['ContactInformation']) if group.key?('ContactInformation')
          new_contact_groups << group
        end
        draft['ContactGroups'] = new_contact_groups unless new_contact_groups.empty?
      end
    end
  end
end
