class UmmC115 < ActiveRecord::Migration[5.2]
  def change
#    collections = Draft.where(draft_type: 'CollectionDraft').where.not(draft: {})
#    collections.each do |collection|
#      # Nothing to migrate if there is no horizontal spatial information
#      next unless collection.draft['SpatialInformation'].present? && ['HORIZONTAL', 'BOTH'].include?(collection.draft['SpatialInformation']['SpatialCoverageType'])
#
#      # Get the old versions of the impacted fields
#      spatial_information = collection.draft['SpatialInformation']
#      spatial_extent = collection.draft['SpatialExtent'] || {}
#
#      # Horizontal Coordinate System is largely transforming into the Resolution and Coordinate System
#      resolution_and_coordinate_system = spatial_information['HorizontalCoordinateSystem'] || {}
#
#      # However, the Geographic Coordinate System is turning into a generic resolution
#      if resolution_and_coordinate_system['GeographicCoordinateSystem'].present?
#        old_horizontal_data_resolution = resolution_and_coordinate_system['GeographicCoordinateSystem']
#        generic_resolution = {}
#        generic_resolution['YDimension'] = old_horizontal_data_resolution['LatitudeResolution'] if old_horizontal_data_resolution['LatitudeResolution'].present?
#        generic_resolution['XDimension'] = old_horizontal_data_resolution['LongitudeResolution'] if old_horizontal_data_resolution['LongitudeResolution'].present?
#        generic_resolution['Unit'] = old_horizontal_data_resolution['GeographicCoordinateUnits'] if old_horizontal_data_resolution['GeographicCoordinateUnits'].present?
#        resolution_and_coordinate_system['HorizontalDataResolution'] = {
#          'GenericResolutions' => [generic_resolution]
#        }
#
#        # Remove the old geographic coordinate system key
#        resolution_and_coordinate_system.delete('GeographicCoordinateSystem')
#      end
#
#      # Now the resolution and coordinate system needs to get into the spatial extent
#      if resolution_and_coordinate_system.present?
#        # The Horizontal Spatial Domain exists and has fields which we don't want to clobber;
#        # Add if it exists or make it if it doesn't
#        if spatial_extent['HorizontalSpatialDomain'].present?
#          spatial_extent['HorizontalSpatialDomain']['ResolutionAndCoordinateSystem'] = resolution_and_coordinate_system
#        else
#          spatial_extent['HorizontalSpatialDomain'] = { 'ResolutionAndCoordinateSystem' => resolution_and_coordinate_system }
#        end
#
#        # Update the spatial extent's coverage type to include horizontal information
#        spatial_extent['SpatialCoverageType'] = if spatial_extent['SpatialCoverageType'] == 'VERTICAL'
#                                                  'HORIZONTAL_VERTICAL'
#                                                elsif spatial_extent['SpatialCoverageType'] == 'ORBITAL'
#                                                  'HORIZONTAL_ORBITAL'
#                                                elsif spatial_extent['SpatialCoverageType'] == 'ORBITAL_VERTICAL'
#                                                  'HORIZONTAL_VERTICAL_ORBITAL'
#                                                elsif %w[HORIZONTAL HORIZONTAL_VERTICAL HORIZONTAL_ORBITAL HORIZONTAL_VERTICAL_ORBITAL].include?(spatial_extent['SpatialCoverageType'])
#                                                  spatial_extent['SpatialCoverageType']
#                                                else
#                                                  'HORIZONTAL'
#                                                end
#      end
#
#      if spatial_information['SpatialCoverageType'] == 'HORIZONTAL'
#        # Remove the spatial information because none of the fields should remain
#        spatial_information = nil
#      else
#        # Remove the horizontal section and leave the vertical
#        spatial_information['SpatialCoverageType'] = 'VERTICAL'
#        spatial_information.delete('HorizontalCoordinateSystem')
#      end
#
#      collection.draft.delete('SpatialInformation')
#      collection.draft.delete('SpatialExtent')
#
#      collection.draft['SpatialInformation'] = spatial_information if spatial_information
#      collection.draft['SpatialExtent'] = spatial_extent if spatial_extent
#    end
  end
end
