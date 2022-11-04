# require 'geo_ruby'

module CmrMetadataPreview
  module SpatialTemporalHelper
    # Collect spatial extent display information
    def get_preview_spatial(metadata)
      point_coordinate_array = []
      rectangle_coordinate_array = []

      if metadata['SpatialExtent'] &&
         metadata['SpatialExtent']['HorizontalSpatialDomain'] &&
         metadata['SpatialExtent']['HorizontalSpatialDomain']['Geometry']

        geometry = metadata['SpatialExtent']['HorizontalSpatialDomain']['Geometry']

        unless geometry['Points'].blank?
          geometry['Points'].each do |point|
            point_coordinate_array << {
              'lat' => point['Latitude'],
              'lon' => point['Longitude']
            }
          end
        end

        unless geometry['BoundingRectangles'].blank?
          geometry['BoundingRectangles'].each do |bounding_rectangle|
            rectangle_coordinate_array << {
              'north_bounding_coordinate' => bounding_rectangle['NorthBoundingCoordinate'],
              'west_bounding_coordinate' => bounding_rectangle['WestBoundingCoordinate'],
              'south_bounding_coordinate' => bounding_rectangle['SouthBoundingCoordinate'],
              'east_bounding_coordinate' => bounding_rectangle['EastBoundingCoordinate']
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
              range_date_times << {
                'beginning_date_time' => range_date_time.fetch('BeginningDateTime', ''),
                'ending_date_time' => range_date_time.fetch('EndingDateTime', '')
              }
            end

          elsif temporal_extent['PeriodicDateTimes']

            temporal_extent['PeriodicDateTimes'].each do |periodic_date_time|
              periodic_date_times << {
                'start_date' => periodic_date_time.fetch('StartDate', ''),
                'end_date' => periodic_date_time.fetch('EndDate', '')
              }
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

        # schema.org is looking for a minimum bounding box here
    # The preview supports spatial extents of bounding box or polygon
    def get_mbr(metadata)
      mbr = nil

      if metadata['south_bounding_coordinate']
        # In the case of bounding box, we simply re-order the points to be conformant with schema.orgs expectations
        mbr = "#{metadata['south_bounding_coordinate']} #{metadata['west_bounding_coordinate']} #{metadata['north_bounding_coordinate']} #{metadata['east_bounding_coordinate']}"
      else
        # Polygon rendering is currently untested
=begin
        results = get_preview_spatial(metadata)
        if results['point_coordinate_array'].size > 0
          # In the case of polygon, we use Georuby to extract the minimum bounding rectangle
          points = ''
          results['point_coordinate_array'].each do |point|
            points.concat("#{point['lat']} #{point['lon']} ")
          end
          bbox = GeoRuby::SimpleFeatures::Polygon.from_points([points.chomp(' ')]).bounding_box
          south = bbox[0].y
          east = bbox[1].x
          north = bbox[1].y
          west = bbox[0].x
          mbr = "#{south} #{west} #{north} #{east}"

        end
=end
      end

      mbr
    end

    def string_to_points(str)
      points = []
      point_array = str.split(' ')
      point_array.each_index do |x|
        points << GeoRuby::SimpleFeatures::Point.from_x_y(point_array[x+1].to_f, point_array[x].to_f) if x.even?
      end
      points
    end
  end
end