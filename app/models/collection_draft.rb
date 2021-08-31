class CollectionDraft < Draft
  # TODO: we currently allow one to be created, but may allow more in the future
  # should we just make this has_one for now?
  has_many :keyword_recommendations, as: :recommendable, dependent: :destroy

  DRAFT_FORMS = %w(
    collection_information
    data_identification
    related_urls
    descriptive_keywords
    acquisition_information
    temporal_information
    spatial_information
    data_centers
    data_contacts
    collection_citations
    metadata_information
    archive_and_distribution_information
  )

  class << self
    def forms
      DRAFT_FORMS
    end

    def get_next_form(name, direction)
      delta = direction == 'Next' ? 1 : -1
      index = DRAFT_FORMS.index(name)
      DRAFT_FORMS[index + delta] || DRAFT_FORMS.first
    end

    def create_from_template(template, user)
      template['draft'].delete('TemplateName')
      draft = CollectionDraft.new do |d|
        d.draft = template.draft
        d.entry_title = template.entry_title
        d.user = user
        d.provider_id = template.provider_id
        d.short_name = template.short_name
      end
      draft.save
      draft
    end

    def create_from_collection(collection, user, native_id)
      # TODO: try to refactor this method for all drafts
      new_entry_title = (collection['EntryTitle'].blank?) ? nil : collection['EntryTitle']

      if native_id
        # Edited record
        draft = self.find_or_create_by(native_id: native_id)
        draft.entry_title = new_entry_title
        draft.short_name = (collection['ShortName'].blank?) ? nil : collection['ShortName']
      else
        # Cloned record
        draft = self.create
        draft.entry_title = "#{new_entry_title} - Cloned"
        collection['EntryTitle'] = "#{new_entry_title} - Cloned"
        draft.short_name = nil
        collection.delete('ShortName')
        collection.delete('MetadataDates')
      end

      draft.set_user_and_provider(user)
      draft.draft = collection
      draft.save
      draft
    end
  end

  def display_entry_title
    entry_title || '<Untitled Collection Record>'
  end

  def set_searchable_fields
    # redefining the method as these fields are different for collection drafts
    # than the other draft types
    self.short_name = draft['ShortName']
    self.entry_title = draft['EntryTitle']
  end

  def update_draft(params, editing_user_id)
    if params
      # RAILS 5.1 This is simpler than permit with a full json structure for collection
      # rethink this in light of CSRF solutions that prevent illegal items in params
      case params
      when ActionController::Parameters
        params = params.permit!.to_h
      end

      if params['template_name']
        self.template_name = params['template_name'].empty? ? nil : params['template_name']
      end

      # Convert {'0' => {'id' => '123'}} to [{'id' => '123'}]
      params = convert_to_arrays(params.clone)

      # Convert parameter keys to CamelCase for UMM;
      json_params = params.to_camel_keys

      Rails.logger.info("Audit Log: Metadata update attempt where #{editing_user_id} modified #{self.class} parameters: #{json_params}")

      # reconfigure params into UMM schema structure and existing data if they are for DataContacts or DataCenters
      json_params = convert_data_contacts_params(json_params)
      json_params = convert_data_centers_params(json_params)

      # Merge new params into draft
      new_draft = self.draft.merge(json_params)

      # Remove empty params from draft
      new_draft = compact_blank(new_draft.clone)

      if new_draft
        self.draft = new_draft
        return save
      elsif self.draft != {}
        # draft had content, but now new_draft is nil/empty so any data has been deleted and saved in the forms
        self.draft = {}
        return save
      end
    end
    # This keeps an empty form from sending the user back to draft_path when clicking on Next
    true
  end

  def add_metadata_dates(date: Time.now.utc, save_record: true)
    # Format the provided date
    current_datetime = date.to_s(:metadata_dates_format)

    # Get the current dates from the metadata dates hash
    dates = draft['MetadataDates'] || []

    # Pull out the created at date
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
    save if save_record
  end

  def keyword_recommendation_needed?
    return unless gkr_enabled?

    draft['Abstract'].present? && keyword_recommendations.first&.recommendation_provided != true
  end

  def record_recommendation_provided(request_id = nil, keyword_list = nil)
    return unless gkr_enabled?

    # for proof of concept, we are only displaying recommendations one time per
    # draft and we should also only be creating one keyword recommendation
    # record per draft
    keyword_recommendations.create(recommendation_provided: true, recommendation_request_id: request_id, recommended_keywords: keyword_list) if keyword_recommendations.blank?
  end

  def gkr_logging_active?
    return false unless gkr_enabled?

    keyword_recommendations.first&.recommendation_request_id.present?
  end

  def gkr_keyword_recommendation_list
    gkr_logging_active? ? keyword_recommendations.first.recommended_keywords : nil
  end

  def gkr_keyword_recommendation_id
    gkr_logging_active? ? keyword_recommendations.first.recommendation_request_id : nil
  end

  private

  INTEGER_KEYS = %w(
    number_of_instruments
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
    average_file_size
    total_collection_file_size
    x_dimension
    y_dimension
    minimum_x_dimension
    minimum_y_dimension
    maximum_x_dimension
    maximum_y_dimension
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

  def add_contact_to_target_data_center(type, target_data_center, current_data_center)
    if type == 'DataCenterContactPerson'
      target_data_center['ContactPersons'] << current_data_center['ContactPerson']
    elsif type == 'DataCenterContactGroup'
      target_data_center['ContactGroups'] << current_data_center['ContactGroup']
    end
  end

  def convert_data_contacts_params(json_params)
    # updating from data contacts form. take all contacts which will be nested under DataContacts,
    # and restructure as ContactPersons and ContactGroups under Data Centers or outside of Data Centers if not affiliated
    return json_params unless json_params.keys == ['DataContacts']

    data_contacts_params = compact_blank(json_params)

    contact_persons = []
    contact_groups = []
    param_data_centers = []
    new_params = {}
    draft_data_centers = self.draft['DataCenters'] || []
    draft_data_centers.each do |data_center|
      data_center['ContactPersons'] = []
      data_center['ContactGroups'] = []
    end
    new_params['DataCenters'] = draft_data_centers
    return new_params if data_contacts_params.nil?

    Array.wrap(data_contacts_params['DataContacts']).each do |data_contact|
      if data_contact['DataContactType'] == 'NonDataCenterContactPerson'
        contact_persons << data_contact['ContactPerson']
      elsif data_contact['DataContactType'] == 'NonDataCenterContactGroup'
        contact_groups << data_contact['ContactGroup']

      elsif data_contact['DataContactType'] == 'DataCenterContactPerson' || data_contact['DataContactType'] == 'DataCenterContactGroup'
        contact_type = data_contact['DataContactType']
        data_center = data_contact['ContactPersonDataCenter'] || data_contact['ContactGroupDataCenter']
        data_center ||= {}
        short_name = data_center['ShortName']
        long_name = data_center['LongName']

        matching_draft_data_center = draft_data_centers.find { |d_data_center| d_data_center['ShortName'] == short_name && d_data_center['LongName'] == long_name }
        matching_param_data_center = param_data_centers.find { |p_data_center| p_data_center['ShortName'] == short_name && p_data_center['LongName'] == long_name }

        if matching_param_data_center
          target = matching_param_data_center
        elsif matching_draft_data_center
          target = matching_draft_data_center
          draft_data_centers.delete(target)
          matching_draft_data_center['ContactPersons'] = []
          matching_draft_data_center['ContactGroups'] = []
          param_data_centers << target
        else
          # no match for data center, create a new one
          target = { 'ShortName' => short_name, 'LongName' => long_name,
                     'ContactPersons' => [], 'ContactGroups' => [] }
          param_data_centers << target
        end

        add_contact_to_target_data_center(contact_type, target, data_center)
      end
    end

    # these params are what will be merged (and overwrite what is in the draft), so we are keeping the new/matched data centers
    # and we need to add back in any unmatched data centers that were in the draft so they won't be erased
    new_params['DataCenters'] = param_data_centers + draft_data_centers
    new_params['ContactPersons'] = contact_persons
    new_params['ContactGroups'] = contact_groups
    new_params
  end

  def convert_data_centers_params(json_params)
    return json_params unless json_params.keys == ['DataCenters']

    # updating from data centers form. we need to make sure to add in any existing data contacts from the draft so they are not erased
    unless self.draft['DataCenters'].blank?
      self.draft['DataCenters'].each do |draft_data_center|
        short_name = draft_data_center['ShortName']
        long_name = draft_data_center['LongName']

        match = json_params['DataCenters'].find { |dc| dc['ShortName'] == short_name && dc['LongName'] == long_name }

        if match
          match['ContactPersons'] = draft_data_center['ContactPersons']
          match['ContactGroups'] = draft_data_center['ContactGroups']
        else
          # no match, so draft_data_center is not in the params
          # if there are no contact persons or groups, no problem
          # if there are contact persons or groups - what to do? keep the contacts or no?
        end
      end
    end

    json_params
  end

  ## Feature Toggle for GKR recommendations
  def gkr_enabled?
    Rails.configuration.gkr_enabled
  end
end
