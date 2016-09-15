class Draft < ActiveRecord::Base
  belongs_to :user
  serialize :draft, JSON
  before_create :default_values
  after_create :set_native_id

  DRAFT_FORMS = %w(
    collection_information
    data_identification
    distribution_information
    descriptive_keywords
    acquisition_information
    temporal_information
    spatial_information
    data_centers
    data_contacts
    collection_citations
    metadata_information
  )

  def self.get_next_form(name, direction)
    delta = direction == 'Next' ? 1 : -1
    index = DRAFT_FORMS.index(name)
    DRAFT_FORMS[index + delta] || DRAFT_FORMS.first
  end

  def display_entry_title
    entry_title || '<Untitled Collection Record>'
  end

  def display_short_name
    short_name || '<Blank Short Name>'
  end

  def update_draft(params, editing_user_id)
    if params
      # pull out searchable fields if provided
      if params['short_name']
        self.entry_title = params['entry_title'].empty? ? nil : params['entry_title']
        self.short_name = params['short_name'].empty? ? nil : params['short_name']
      end

      # Convert {'0' => {'id' => 123'}} to [{'id' => '123'}]
      params = convert_to_arrays(params.clone)
      # Convert parameter keys to CamelCase for UMM
      json_params = params.to_hash.to_camel_keys
      Rails.logger.info("Audit Log: #{editing_user_id} modified Draft Parameters: #{json_params}")

      json_params = transform_data_contacts(json_params)
      # Merge new params into draft
      new_draft = self.draft.merge(json_params)

      # Remove empty params from draft
      new_draft = compact_blank(new_draft.clone)

      if new_draft
        self.draft = new_draft
        save
      elsif self.draft != {}
        # draft had content, but now new_draft is nil/empty so any data has been deleted and saved in the forms
        self.draft = {}
        save
      end
    end
    # This keeps an empty form from sending the user back to draft_path when clicking on Next
    true
  end

  def self.create_from_collection(collection, user, native_id)
    new_entry_title = (collection['EntryTitle'] && collection['EntryTitle'].empty?) ? nil : collection['EntryTitle']

    if native_id
      # Edited record
      draft = Draft.find_or_create_by(native_id: native_id)
      draft.entry_title = new_entry_title
      draft.short_name = (collection['ShortName'] && collection['ShortName'].empty?) ? nil : collection['ShortName']
    else
      # Cloned record
      draft = Draft.create
      draft.entry_title = "#{new_entry_title} - Cloned"
      collection['EntryTitle'] = "#{new_entry_title} - Cloned"
      draft.short_name = nil
      collection.delete('ShortName')
      collection.delete('MetadataDates')
    end
    draft.user = user
    draft.provider_id = user.provider_id # TODO is this problematic for collections editing permissions?
    draft.draft = collection
    draft.save
    Rails.logger.info("Draft created by #{user.urs_uid} for collection #{draft.entry_title} for provider #{user.provider_id}")
    draft
  end

  def add_metadata_dates
    current_datetime = Time.now.utc.strftime('%Y-%m-%dT%H:%M:00.000Z')
    dates = draft['MetadataDates'] || []

    create_datetime = dates.find { |date| date['Type'] == 'CREATE' }
    if create_datetime
      new_dates = [
        { 'Type' => 'CREATE', 'Date' => create_datetime['Date'] },
        { 'Type' => 'UPDATE', 'Date' => current_datetime }
      ]
    else
      new_dates = [
        { 'Type' => 'CREATE', 'Date' => current_datetime },
        { 'Type' => 'UPDATE', 'Date' => current_datetime }
      ]
    end

    dates.reject! { |date| date['Type'] == 'CREATE' || date['Type'] == 'UPDATE' }
    dates += new_dates
    draft['MetadataDates'] = dates
    save
  end

  private

  INTEGER_KEYS = %w(
    number_of_sensors
    duration_value
    period_cycle_duration_value
    precision_of_seconds
  )
  NUMBER_KEYS = %w(
    size
    longitude
    latitude
    minimum_value
    maximum_value
    west_bounding_coordinate
    north_bounding_coordinate
    east_bounding_coordinate
    south_bounding_coordinate
    denominator_of_flattening_ratio
    semi_major_axis
    latitude_resolution
    longitude_resolution
    swath_width
    inclination_angle
    number_of_orbits
    start_circular_latitude
    distribution_size
  )
  BOOLEAN_KEYS = %w(
    ends_at_present_flag
  )

  SCIENCE_KEYWORD_LEVELS = %w(
    Category
    Topic
    Term
    VariableLevel1
    VariableLevel2
    VariableLevel3
    DetailedVariable
  )

  LOCATION_KEYWORD_TIERS = %w(
    Category
    Type
    Subregion1
    Subregion2
    Subregion3
    DetailedLocation
  )

  def convert_to_arrays(object)
    case object
    when Hash
      # if the first key is an integer, change hash to array
      keys = object.keys
      if keys.first =~ /\d+/
        object = object.map { |_key, value| value }
        object.each do |value|
          convert_to_arrays(value)
        end
      else
        object.each do |key, value|
          if INTEGER_KEYS.include?(key)
            object[key] = convert_to_integer(value)
          elsif NUMBER_KEYS.include?(key)
            object[key] = convert_to_number(value)
          elsif BOOLEAN_KEYS.include?(key)
            object[key] = value == 'true' ? true : false unless value.empty?
          elsif key == 'resolutions'
            object[key] = value.map { |_key, resolution| convert_to_number(resolution) }
          elsif key == 'science_keywords'
            object[key] = convert_science_keywords(value)
          elsif key == 'location_keywords'
            object[key] = convert_location_keywords(value)
          elsif key == 'access_constraints'
            # 'Value' shows up multiple times in the UMM. We just need to convert AccessConstraints/Value to a number
            value['value'] = convert_to_number(value['value']) if value['value']
            object[key] = value
          # elsif key == 'data_contacts'
          else
            if key == 'orbit_parameters'
              # There are two fields named 'Period' but only one of them is a number.
              # Convert the correct 'Period' to a number
              period = value['period']
              value['period'] = convert_to_number(period)
              object[key] = value
            end
            object[key] = convert_to_arrays(value)
          end
        end
      end
    # if value is array, loop through each hash
    when Array
      object.each do |obj|
        convert_to_arrays(obj)
      end
    end
    object
  end

  def convert_to_integer(string)
    unless string.empty?
      stripped_string = string.delete(',')

      begin
        integer = Integer(stripped_string)
      rescue
        integer = string
      end

      integer
    end
  end

  def convert_to_number(string)
    unless string.empty?
      stripped_string = string.delete(',')

      begin
        number = Float(stripped_string)
      rescue
        number = string
      end

      number
    end
  end

  def compact_blank(node)
    return node.map { |n| compact_blank(n) }.compact.presence if node.is_a?(Array)
    return node if node == false
    return node.presence unless node.is_a?(Hash)
    result = {}
    node.each do |k, v|
      result[k] = compact_blank(v)
    end
    result = result.compact
    result.compact.presence
  end

  def convert_science_keywords(science_keywords)
    values = []
    if science_keywords.length > 0
      science_keywords.each do |science_keyword|
        value = {}
        keywords = science_keyword.split(' > ')
        keywords.each_with_index do |keyword, index|
          value[SCIENCE_KEYWORD_LEVELS[index]] = keyword
        end
        values << value
      end
    end
    values
  end

  def convert_location_keywords(location_keywords)
    values = []
    if location_keywords.length > 0
      location_keywords.each do |location_keyword|
        value = {}
        keywords = location_keyword.split(' > ')
        keywords.each_with_index do |keyword, index|
          value[LOCATION_KEYWORD_TIERS[index]] = keyword
        end
        values << value
      end
    end
    values
  end

  def add_contacts_to_data_center(data_contact, target_data_center)
    data_center = data_contact['DataCenter']
    if data_contact['DataContactType'] == 'DataCenterContactPerson'
      target_data_center['ContactPersons'] << data_center['ContactPerson']
    elsif data_contact['DataContactType'] == 'DataCenterContactGroup'
      target_data_center['ContactGroups'] << data_center['ContactGroup']
    end
  end

  def transform_data_contacts(json_params) # transform, ensure, repackage,
    return json_params unless json_params.keys == ['DataContacts']

    contact_persons = []
    contact_groups = []
    param_data_centers = []
    new_params = {}

    # data contact should come in in a separated/nested structure
    # will be converted into the schema structure we need here
    # this method should be called in update_draft or convert_to_arrays (maybe latter)

    draft_data_centers = self.draft['DataCenters'] || []
    data_contacts_params = compact_blank(json_params) # TODO maybe need to try and do it with compact_blank at end???
    data_contacts_params['DataContacts'].each do |data_contact|
      if data_contact['DataContactType'] == 'NonDataCenterContactPerson'
        contact_persons << data_contact['ContactPerson']
      elsif data_contact['DataContactType'] == 'NonDataCenterContactGroup'
        contact_groups << data_contact['ContactGroup']
      elsif data_contact['DataContactType'] == 'DataCenterContactPerson' || data_contact['DataContactType'] == 'DataCenterContactGroup'
        # data center short names & long names
        data_center = data_contact['DataCenter']
        short_name = data_center['ShortName']
        long_name = data_center['LongName']

        # match_data_centers
          # find returns first; select returns array with all matches
        matching_draft_data_center = draft_data_centers.find { |d_data_center| d_data_center['ShortName'] == short_name && d_data_center['LongName'] == long_name }
        matching_param_data_center = param_data_centers.find { |p_data_center| p_data_center['ShortName'] == short_name && p_data_center['LongName'] == long_name }
        if matching_param_data_center
          # TODO need to verify deleting the data center allows us to still manipulate and add it back
          param_data_centers.delete(matching_param_data_center)
          # if data_contact['DataContactType'] == 'DataCenterContactPerson'
          #   matching_param_data_center['ContactPersons'] << data_center['ContactPerson']
          # elsif data_contact['DataContactType'] == 'DataCenterContactGroup'
          #   matching_param_data_center['ContactGroups'] << data_center['ContactGroup']
          # end
          add_contacts_to_data_center(data_contact, matching_param_data_center)
          param_data_centers << matching_param_data_center
        elsif matching_draft_data_center
          matching_draft_data_center['ContactPersons'] = []
          matching_draft_data_center['ContactGroups'] = []
          # if data_contact['DataContactType'] == 'DataCenterContactPerson'
          #   matching_draft_data_center['ContactPersons'] << data_center['ContactPerson']
          # elsif data_contact['DataContactType'] == 'DataCenterContactGroup'
          #   matching_draft_data_center['ContactGroups'] << data_center['ContactGroup']
          # end
          add_contacts_to_data_center(data_contact, matching_draft_data_center)
          param_data_centers << matching_draft_data_center
        else
          # else
            # if data center in draft, output data center = draft['DataCenter']
            # else add this data center (shortname, longname) to output
          new_data_center = { 'ShortName' => short_name, 'LongName' => long_name, 'ContactPersons' => [], 'ContactGroups' => [] }
          # if data_contact['DataContactType'] == 'DataCenterContactPerson'
          #   new_data_center['ContactPersons'] << data_center['ContactPerson']
          # elsif data_contact['DataContactType'] == 'DataCenterContactGroup'
          #   new_data_center['ContactGroups'] << data_center['ContactGroup']
          # end
          add_contacts_to_data_center(data_contact, new_data_center)
          param_data_centers << new_data_center
        end
      end
    end

    new_params['DataCenters'] = param_data_centers
    new_params['ContactPersons'] = contact_persons
    new_params['ContactGroups'] = contact_groups
    new_params

    # test all data contacts. if the data contacts have contact persons and contact groups for same data center
    #   need to combine them
    # on merge, need to check/match if there is a data center with the short name/long name
    #   make the data center here the data center there replace the contact person and groups with these

  end

  def default_values
    self.draft ||= {}
  end

  def set_native_id
    self.native_id ||= "mmt_collection_#{id}"
    save
  end
end
