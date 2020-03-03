module Helpers
  module DataMigrationHelper

    # This mirrors the logic of the migration for the umm-c update.
    def umm_c_1_15_migration_test(draft)
      # Nothing to migrate if there is no horizontal spatial information
      return draft unless draft['SpatialInformation'].present? && ['HORIZONTAL', 'BOTH'].include?(draft['SpatialInformation']['SpatialCoverageType'])

      spatial_information = draft.delete('SpatialInformation') || {}
      spatial_extent = draft.delete('SpatialExtent') || {}

      # Horizontal Coordinate System is largely transforming into the
      # Resolution and Coordinate System. This will include Geodetic Model if present
      resolution_and_coordinate_system = spatial_information.delete('HorizontalCoordinateSystem') || {}

      # However, the Geographic Coordinate System is turning into a generic resolution
      if resolution_and_coordinate_system['GeographicCoordinateSystem'].present?
        old_horizontal_data_resolution = resolution_and_coordinate_system.delete('GeographicCoordinateSystem')
        generic_resolution = {}
        generic_resolution['YDimension'] = old_horizontal_data_resolution['LatitudeResolution'] if old_horizontal_data_resolution['LatitudeResolution'].present?
        generic_resolution['XDimension'] = old_horizontal_data_resolution['LongitudeResolution'] if old_horizontal_data_resolution['LongitudeResolution'].present?
        generic_resolution['Unit'] = old_horizontal_data_resolution['GeographicCoordinateUnits'] if old_horizontal_data_resolution['GeographicCoordinateUnits'].present?
        resolution_and_coordinate_system['HorizontalDataResolution'] = {
          'GenericResolutions' => [generic_resolution]
        }
      end

      # Now the resolution and coordinate system needs to get into the spatial extent
      if resolution_and_coordinate_system.present?
        # The Horizontal Spatial Domain exists and has fields which we don't want to clobber;
        # Add if it exists or make it if it doesn't
        if spatial_extent['HorizontalSpatialDomain'].present?
          spatial_extent['HorizontalSpatialDomain']['ResolutionAndCoordinateSystem'] = resolution_and_coordinate_system
        else
          spatial_extent['HorizontalSpatialDomain'] = { 'ResolutionAndCoordinateSystem' => resolution_and_coordinate_system }
        end

        # Update the spatial extent's coverage type to include horizontal information
        spatial_extent['SpatialCoverageType'] = if spatial_extent['SpatialCoverageType'] == 'VERTICAL'
                                                  'HORIZONTAL_VERTICAL'
                                                elsif spatial_extent['SpatialCoverageType'] == 'ORBITAL'
                                                  'HORIZONTAL_ORBITAL'
                                                elsif spatial_extent['SpatialCoverageType'] == 'ORBITAL_VERTICAL'
                                                  'HORIZONTAL_VERTICAL_ORBITAL'
                                                elsif %w[HORIZONTAL HORIZONTAL_VERTICAL HORIZONTAL_ORBITAL HORIZONTAL_VERTICAL_ORBITAL].include?(spatial_extent['SpatialCoverageType'])
                                                  spatial_extent['SpatialCoverageType']
                                                else
                                                  'HORIZONTAL'
                                                end
      end

      if spatial_information['SpatialCoverageType'] == 'HORIZONTAL'
        # Remove the spatial information because none of the fields should remain
        spatial_information = nil
      elsif spatial_information['SpatialCoverageType'] == 'BOTH'
        # Remove the horizontal section and leave the vertical
        spatial_information['SpatialCoverageType'] = 'VERTICAL'
      end

      draft['SpatialInformation'] = spatial_information unless spatial_information.blank?
      draft['SpatialExtent'] = spatial_extent unless spatial_extent.blank?

      draft
    end
  end
end
