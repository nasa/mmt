class Draft < ActiveRecord::Base
  belongs_to :user
  serialize :draft, JSON

  DRAFT_FORMS = [ # array of hashes provide flexibility to add additional fiels
      {:form_partial_name=>'data_identification'},
      {:form_partial_name=>'descriptive_keywords'},
      {:form_partial_name=>'metadata_information'},
      {:form_partial_name=>'temporal_extent'},
      {:form_partial_name=>'spatial_extent'},
      {:form_partial_name=>'acquisition_information'},
      {:form_partial_name=>'distribution_information'}
  ]

  def self.get_next_form(cur_form_name)
    DRAFT_FORMS.each_with_index do |f, i|
      if f[:form_partial_name] == cur_form_name
        next_index = i+1
        next_index = 0 if next_index == DRAFT_FORMS.size
        return DRAFT_FORMS[next_index][:form_partial_name]
      end
    end
    return nil
  end

  def display_entry_title
    self.entry_title || '<Untitled Collection Record>'
  end

  def display_entry_id
    self.entry_id || '<Blank Entry Id>'
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
      new_draft = self.draft.merge(json_params)
      # Remove empty params from draft
      new_draft = compact_blank(new_draft.clone)

      if new_draft
        self.draft = new_draft
        self.save
      end
    end
    # This keeps an empty form from sending the user back to draft_path when clicking on Save & Next
    true
  end


  def get_preview_spatial
    # Calculate spatial extent display information

    point_coordinate_array = []
    rectangle_coordinate_array = []

    if self.draft['SpatialExtent'] &&
      self.draft['SpatialExtent']['HorizontalSpatialDomain'] &&
      self.draft['SpatialExtent']['HorizontalSpatialDomain']['Geometry']

      map_width = 305
      map_height = 153
      highlight_color = "rgba(250,0,0,0.25)"

      geometry = self.draft['SpatialExtent']['HorizontalSpatialDomain']['Geometry']

      if !geometry['Points'].blank?

        dot_size = 5;

        geometry['Points'].each do |point|
          x, y = convert_lat_lon_to_image_x_y(point['Latitude'], point['Longitude'], map_width, map_height)
          point_coordinate_array <<  {'lat'=>point['Latitude'], 'lon'=>point['Longitude'], 'x'=>x, 'y'=>y}
        end

      end

      if !geometry['BoundingRectangles'].blank?

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

          rectangle_coordinate_array << {'north_bounding_coordinate'=>north_bounding_coordinate,
                                         'west_bounding_coordinate'=>west_bounding_coordinate,
                                         'south_bounding_coordinate'=>south_bounding_coordinate,
                                         'east_bounding_coordinate'=>east_bounding_coordinate,
                                         'min_x'=>min_x, 'min_y'=>min_y, 'max_x'=>max_x, 'max_y'=>max_y}
        end

      end
    end

    preview_spatial_hash = {}
    preview_spatial_hash['point_coordinate_array'] = point_coordinate_array if !point_coordinate_array.blank?
    preview_spatial_hash['rectangle_coordinate_array'] = rectangle_coordinate_array if !rectangle_coordinate_array.blank?

    return preview_spatial_hash
  end


  def get_preview_temporal
    # Collect temporal extent display information

    single_date_times = []
    range_date_times = []
    periodic_date_times = []

    if !self.draft['TemporalExtents'].blank?
      self.draft['TemporalExtents'].each do |temporal_extent|

        if temporal_extent['TemporalRangeType'] == 'SingleDateTime'

          temporal_extent['SingleDateTimes'].each do |single_date_time|
            single_date_times << single_date_time
          end

        elsif temporal_extent['TemporalRangeType'] == 'RangeDateTime'

          temporal_extent['RangeDateTimes'].each do |range_date_time|
            range_date_times << {'beginning_date_time'=>range_date_time['BeginningDateTime'], 'ending_date_time'=>range_date_time['EndingDateTime']}
          end

        elsif temporal_extent['TemporalRangeType'] == 'PeriodicDateTime'

          temporal_extent['PeriodicDateTimes'].each do |periodic_date_time|
            periodic_date_times << {'start_date'=>periodic_date_time['StartDate'], 'end_date'=>periodic_date_time['EndDate']}
          end

        end

      end
    end

    preview_temporal_hash = {}
    preview_temporal_hash['single_date_times'] = single_date_times if !single_date_times.blank?
    preview_temporal_hash['range_date_times'] = range_date_times if !range_date_times.blank?
    preview_temporal_hash['periodic_date_times'] = periodic_date_times if !periodic_date_times.blank?

    return preview_temporal_hash
  end

  private

  INTEGER_KEYS = [
    'number_of_sensors',
    'duration_value',
    'period_cycle_duration_value',
    'precision_of_seconds'
  ]
  NUMBER_KEYS = [
    'size',
    'fees',
    'longitude',
    'latitude',
    'minimum_value',
    'maximum_value',
    'west_bounding_coordinate',
    'north_bounding_coordinate',
    'east_bounding_coordinate',
    'south_bounding_coordinate',
    'denominator_of_flattening_ratio',
    'semi_major_axis',
    'latitude_resolution',
    'longitude_resolution',
    'swath_width',
    'inclination_angle',
    'number_of_orbits',
    'start_circular_latitude',
    'resolutions'
  ]
  BOOLEAN_KEYS = ['ends_at_present_flag']

  def convert_to_arrays(object)
    case object
    when Hash
      # if the first key is an integer, change hash to array
      keys = object.keys
      if keys.first =~ /\d+/
        object = object.map{|key, value| value}
        object.each do |value|
          value = convert_to_arrays(value)
        end
      else
        object.each do |key, value|
          if INTEGER_KEYS.include?(key)
            object[key] = value.to_i unless value.empty?
          elsif NUMBER_KEYS.include?(key)
            object[key] = convert_to_number(value)
          elsif BOOLEAN_KEYS.include?(key)
            object[key] = value == 'true' ? true : false unless value.empty?
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
        obj = convert_to_arrays(obj)
      end
    end
    object
  end

  def convert_to_number(string)
    if string.is_a? Array
      string.map{ |s| s.gsub(/[^\-0-9.]/, '').to_f unless s.empty? }
    else
      string.gsub(/[^\-0-9.]/, '').to_f unless string.empty?
    end
  end

  def compact_blank(node)
    return node.map {|n| compact_blank(n)}.compact.presence if node.is_a?(Array)
    return node if node == false
    return node.presence unless node.is_a?(Hash)
    result = {}
    node.each do |k, v|
      result[k] = compact_blank(v)
    end
    result = result.compact
    result.compact.presence
  end

  def convert_lat_lon_to_image_x_y(lat, lon, map_width, map_height) # Do a simple transformation to map lat/lon onto y/x of map image
    y = ((-1 * lat) + 90) * (map_height / 180.0);
    x = (180 + lon) * (map_width / 360.0);
    return x, y
  end


end
