module CollectionsHelper

  # methods primarily used in CollectionsController, moved here to allow other controllers access
  def set_collection
    @concept_id = params[:id]
    revision_id = params[:revision_id]

    set_collection_link(@concept_id)
    set_num_granules(@concept_id)

    @revisions = get_revisions(@concept_id, revision_id)

    latest = @revisions.first

    # if there is at least one revision available
    if latest
      @native_id = latest['meta']['native-id']
      @provider_id = latest['meta']['provider-id']
      concept_format = latest['meta']['format']

      if !revision_id.nil? && latest['meta']['revision-id'].to_s != revision_id.to_s
        @old_revision = true
      end

      # retrieve native metadata
      @metadata = cmr_client.get_concept(@concept_id, token, revision_id)

      # translate to umm-json metadata if needed
      if concept_format == 'application/vnd.nasa.cmr.umm+json'
        @collection = @metadata
      else
        @collection = cmr_client.translate_collection(@metadata, concept_format, "application/#{Rails.configuration.umm_version}", true).body
      end
    else
      # concept wasn't found, CMR might be a little slow
      # Take the user to a blank page with a message the collection doesn't exist yet,
      # eventually auto refreshing the page would be cool
      @collection = {}
      @error = 'Your collection is being published. This page will show your published collection once it is ready. Please check back soon.'
    end
  end

  def get_revisions(concept_id, revision_id)
    # if the revision is not found, try again because CMR might be a little slow to index if it is a newly published revision
    attempts = 0
    while attempts < 3
      revisions = cmr_client.get_collections({ concept_id: concept_id, all_revisions: true }, token).body['items']
      revisions.sort! { |a, b| b['meta']['revision-id'] <=> a['meta']['revision-id'] }
      latest = revisions.first
      break if latest && !revision_id
      break if latest && latest['meta']['revision-id'] >= revision_id.to_i
      attempts += 1
      sleep 2
    end

    revisions
  end

  def set_collection_link(concept_id)
    # collection_link used for downloading XML
    base_url = 'http://localhost:3003'
    if Rails.env.sit?
      base_url = 'https://cmr.sit.earthdata.nasa.gov/search'
    elsif Rails.env.uat?
      base_url = 'https://cmr.uat.earthdata.nasa.gov/search'
    elsif Rails.env.production?
      base_url = 'https://cmr.earthdata.nasa.gov/search'
    end
    @collection_link = "#{base_url}/concepts/#{concept_id}"
  end

  def set_num_granules(concept_id)
    # Get granule count, will be replaced once CMR-2053 is complete
    granule_result = cmr_client.get_granule_count(concept_id, token)
    @num_granules = granule_result.nil? ? 0 : granule_result['granule_count']
  end

  def display_collection_entry_title(collection)
    collection['EntryTitle'] || 'Entry Title Not Provided'
  end

  # Calculate spatial extent display information
  def get_preview_spatial(metadata)
    point_coordinate_array = []
    rectangle_coordinate_array = []

    if metadata['SpatialExtent'] &&
       metadata['SpatialExtent']['HorizontalSpatialDomain'] &&
       metadata['SpatialExtent']['HorizontalSpatialDomain']['Geometry']

      map_width = 305
      map_height = 153

      geometry = metadata['SpatialExtent']['HorizontalSpatialDomain']['Geometry']

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
    preview_spatial_hash['point_coordinate_array'] = point_coordinate_array
    preview_spatial_hash['rectangle_coordinate_array'] = rectangle_coordinate_array

    preview_spatial_hash
  end

  # Collect temporal extent display information
  def get_preview_temporal(metadata)
    single_date_times = []
    range_date_times = []
    periodic_date_times = []

    unless metadata['TemporalExtents'].blank?
      metadata['TemporalExtents'].each do |temporal_extent|
        if temporal_extent['SingleDateTimes']

          temporal_extent['SingleDateTimes'].each do |single_date_time|
            single_date_times << single_date_time
          end

        elsif temporal_extent['RangeDateTimes']

          temporal_extent['RangeDateTimes'].each do |range_date_time|
            range_date_times << { 'beginning_date_time' => range_date_time['BeginningDateTime'], 'ending_date_time' => range_date_time['EndingDateTime'] }
          end

        elsif temporal_extent['PeriodicDateTimes']

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

  # Do a simple transformation to map lat/lon onto y/x of map image
  def convert_lat_lon_to_image_x_y(lat, lon, map_width, map_height)
    begin
      y = ((-1 * lat) + 90) * (map_height / 180.0)
      x = (180 + lon) * (map_width / 360.0)
      [x, y]
    rescue
      nil
    end
  end
end
