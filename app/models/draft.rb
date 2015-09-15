class Draft < ActiveRecord::Base
  belongs_to :user
  serialize :draft, JSON

  DRAFT_FORMS = [ # array of hashes provide flexibility to add additional fiels
    { form_partial_name: 'data_identification' },
    { form_partial_name: 'descriptive_keywords' },
    { form_partial_name: 'metadata_information' },
    { form_partial_name: 'temporal_extent' },
    { form_partial_name: 'spatial_extent' },
    { form_partial_name: 'acquisition_information' },
    { form_partial_name: 'distribution_information' }
  ]

  def self.get_next_form(cur_form_name)
    DRAFT_FORMS.each_with_index do |f, i|
      if f[:form_partial_name] == cur_form_name
        next_index = i + 1
        next_index = 0 if next_index == DRAFT_FORMS.size
        return DRAFT_FORMS[next_index][:form_partial_name]
      end
    end
    nil
  end

  def display_entry_title
    entry_title || '<Untitled Collection Record>'
  end

  def display_entry_id
    entry_id || '<Blank Entry Id>'
  end

  def update_draft(params)
    if params
      # pull out searchable fields if provided
      if params['entry_id']
        self.entry_title = params['entry_title'].empty? ? nil : params['entry_title']
        self.entry_id = params['entry_id'].empty? ? nil : params['entry_id']
      end

      # The provider_id isn't actually part of the metadata. You can think of that as the owner of the metadata. It's meta-metadata.
      # self.provider_id = ?

      # Convert {'0' => {'id' => 123'}} to [{'id' => '123'}]
      params = convert_to_arrays(params.clone)
      # Convert parameter keys to CamelCase for UMM
      json_params = params.to_hash.to_camel_keys
      # Merge new params into draft
      new_draft = draft.merge(json_params)
      # Remove empty params from draft
      new_draft = compact_blank(new_draft.clone)

      if new_draft
        self.draft = new_draft
        save
      end
    end
    # This keeps an empty form from sending the user back to draft_path when clicking on Save & Next
    true
  end

  # Calculate spatial extent display information
  def get_preview_spatial
    point_coordinate_array = []
    rectangle_coordinate_array = []

    if draft['SpatialExtent'] &&
       draft['SpatialExtent']['HorizontalSpatialDomain'] &&
       draft['SpatialExtent']['HorizontalSpatialDomain']['Geometry']

      map_width = 305
      map_height = 153

      geometry = draft['SpatialExtent']['HorizontalSpatialDomain']['Geometry']

      unless geometry['Points'].blank?

        geometry['Points'].each do |point|
          x, y = convert_lat_lon_to_image_x_y(point['Latitude'], point['Longitude'], map_width, map_height)
          point_coordinate_array << {
            'lat' => point['Latitude'],
            'lon' => point['Longitude'],
            'x' => x,
            'y' => y
          }
        end

      end

      unless geometry['BoundingRectangles'].blank?
        geometry['BoundingRectangles'].each do |bounding_rectangle|
          north_bounding_coordinate = bounding_rectangle['NorthBoundingCoordinate']
          west_bounding_coordinate = bounding_rectangle['WestBoundingCoordinate']
          south_bounding_coordinate = bounding_rectangle['SouthBoundingCoordinate']
          east_bounding_coordinate = bounding_rectangle['EastBoundingCoordinate']

          x1, y1 = convert_lat_lon_to_image_x_y(north_bounding_coordinate, west_bounding_coordinate, map_width, map_height)
          x2, y2 = convert_lat_lon_to_image_x_y(south_bounding_coordinate, east_bounding_coordinate, map_width, map_height)
          min_x = [x1, x2].min
          max_x = [x1, x2].max
          min_y = [y1, y2].min
          max_y = [y1, y2].max

          rectangle_coordinate_array << {
            'north_bounding_coordinate' => north_bounding_coordinate,
            'west_bounding_coordinate' => west_bounding_coordinate,
            'south_bounding_coordinate' => south_bounding_coordinate,
            'east_bounding_coordinate' => east_bounding_coordinate,
            'min_x' => min_x,
            'min_y' => min_y,
            'max_x' => max_x,
            'max_y' => max_y
          }
        end

      end
    end

    preview_spatial_hash = {}
    preview_spatial_hash['point_coordinate_array'] = point_coordinate_array unless point_coordinate_array.blank?
    preview_spatial_hash['rectangle_coordinate_array'] = rectangle_coordinate_array unless rectangle_coordinate_array.blank?

    preview_spatial_hash
  end

  # Collect temporal extent display information
  def get_preview_temporal
    single_date_times = []
    range_date_times = []
    periodic_date_times = []

    unless draft['TemporalExtents'].blank?
      draft['TemporalExtents'].each do |temporal_extent|
        if temporal_extent['TemporalRangeType'] == 'SingleDateTime'

          temporal_extent['SingleDateTimes'].each do |single_date_time|
            single_date_times << single_date_time
          end

        elsif temporal_extent['TemporalRangeType'] == 'RangeDateTime'

          temporal_extent['RangeDateTimes'].each do |range_date_time|
            range_date_times << { 'beginning_date_time' => range_date_time['BeginningDateTime'], 'ending_date_time' => range_date_time['EndingDateTime'] }
          end

        elsif temporal_extent['TemporalRangeType'] == 'PeriodicDateTime'

          temporal_extent['PeriodicDateTimes'].each do |periodic_date_time|
            periodic_date_times << { 'start_date' => periodic_date_time['StartDate'], 'end_date' => periodic_date_time['EndDate'] }
          end

        end
      end
    end

    preview_temporal_hash = {}
    preview_temporal_hash['single_date_times'] = single_date_times unless single_date_times.blank?
    preview_temporal_hash['range_date_times'] = range_date_times unless range_date_times.blank?
    preview_temporal_hash['periodic_date_times'] = periodic_date_times unless periodic_date_times.blank?

    preview_temporal_hash
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
    fees
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
    resolutions
  )
  BOOLEAN_KEYS = %w(
    ends_at_present_flag
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
            object[key] = value.to_i unless value.empty?
          elsif NUMBER_KEYS.include?(key)
            object[key] = convert_to_number(value)
          elsif BOOLEAN_KEYS.include?(key)
            object[key] = value == 'true' ? true : false unless value.empty?
          elsif key == 'science_keywords'
            object[key] = convert_science_keywords(value)
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

  def convert_to_number(string)
    if string.is_a? Array
      string.map { |s| s.gsub(/[^\-0-9.]/, '').to_f unless s.empty? }
    else
      string.gsub(/[^\-0-9.]/, '').to_f unless string.empty?
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

  # Do a simple transformation to map lat/lon onto y/x of map image
  def convert_lat_lon_to_image_x_y(lat, lon, map_width, map_height)
    y = ((-1 * lat) + 90) * (map_height / 180.0)
    x = (180 + lon) * (map_width / 360.0)
    [x, y]
  end

  def convert_science_keywords(science_keywords)
    values = []
    if science_keywords.length > 0
      science_keywords.each do |keyword|
        value = {}
        keywords = keyword.split(' > ')
        value['Category'] = keywords[0] if keywords[0]
        value['Topic'] = keywords[1] if keywords[1]
        value['Term'] = keywords[2] if keywords[2]
        value['VariableLevel1'] = keywords[3] if keywords[3]
        value['VariableLevel2'] = keywords[4] if keywords[4]
        value['VariableLevel3'] = keywords[5] if keywords[5]
        value['DetailedVariable'] = keywords[6] if keywords[6]
        values << value
      end
    end
    values
  end
end
