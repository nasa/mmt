# https://github.com/nasa/Common-Metadata-Repository/blob/master/umm-spec-lib/src/cmr/umm_spec/migration/version/collection.clj#L208
# interface/migrate-umm-version [:collection "1.9" "1.10"]

class UmmC19To110 < ActiveRecord::Migration[4.2]
  def up
    CollectionDraft.find_each do |d|
      draft = d.draft

      # Update TilingIdentificationSystemName with enum values
      # "Drop invalid TilingIdentificationSystems, and ensure that valid ones are cased properly."
      if draft.key? 'TilingIdentificationSystems'
        Array.wrap(draft['TilingIdentificationSystems']).each do |tiling_identification_system|
          name = tiling_identification_system.delete('TilingIdentificationSystemName')

          ['CALIPSO', 'MISR', 'MODIS Tile EASE', 'MODIS Tile SIN', 'WELD Alaska Tile', 'WELD CONUS Tile', 'WRS-1', 'WRS-2'].each do |enum_name|
            if enum_name.upcase == name.upcase
              name = enum_name
              break
            end
          end

          tiling_identification_system['TilingIdentificationSystemName'] = name unless name.nil?
        end
      end

      # Update CollectionProgress with enum values
      if draft.key? 'CollectionProgress'
        draft['CollectionProgress'] = 'ACTIVE' if draft['CollectionProgress'] == 'IN WORK'

        draft['CollectionProgress'] = 'NOT PROVIDED' unless ['COMPLETE', 'ACTIVE', 'PLANNED', 'NOT APPLICABLE', 'NOT PROVIDED'].include? draft['CollectionProgress']
      end

      # remove TemporalRangeType
      if draft.key? 'TemporalExtents'
        Array.wrap(draft['TemporalExtents']).each do |temporal_extent|
          temporal_extent.delete('TemporalRangeType')
        end
      end

      # Remove EncodingMethod
      if draft.key? 'SpatialInformation'
        spatial_information = draft['SpatialInformation']

        if spatial_information.key? 'VerticalCoordinateSystem'
          coordinate_system = spatial_information['VerticalCoordinateSystem']

          if coordinate_system.key? 'AltitudeSystemDefinition'
            coordinate_system['AltitudeSystemDefinition'].delete('EncodingMethod')
          end

          if coordinate_system.key? 'DepthSystemDefinition'
            coordinate_system['DepthSystemDefinition'].delete('EncodingMethod')
          end
        end
      end

      # Update GeographicCoordinateUnits with enum values
      # Upcase the name and see if it matches the enum
      geographic_coordinate_units = draft.fetch('SpatialInformation', {}).fetch('HorizontalCoordinateSystem', {}).fetch('GeographicCoordinateSystem', {}).delete('GeographicCoordinateUnits')
      unless geographic_coordinate_units.nil?
        new_unit = geographic_coordinate_units
        ['Decimal Degrees', 'Kilometers', 'Meters'].each do |unit|
          if unit.upcase == geographic_coordinate_units.upcase
            new_unit = unit
          end
        end

        draft['SpatialInformation']['HorizontalCoordinateSystem']['GeographicCoordinateSystem']['GeographicCoordinateUnits'] = new_unit unless new_unit.nil?
      end

      # Update DistanceUnits with enum values
      # Altitude DistanceUnits
      altitude_distance_units = draft.fetch('SpatialInformation', {}).fetch('VerticalCoordinateSystem', {}).fetch('AltitudeSystemDefinition', {}).delete('DistanceUnits')
      unless altitude_distance_units.nil?
        new_unit = altitude_distance_units
        %w[HectoPascals Kilometers Millibars].each do |unit|
          new_unit = unit if unit.upcase == altitude_distance_units.upcase
        end

        draft['SpatialInformation']['VerticalCoordinateSystem']['AltitudeSystemDefinition']['DistanceUnits'] = new_unit unless new_unit.nil?
      end

      # Depth DistanceUnits
      depth_distance_units = draft.fetch('SpatialInformation', {}).fetch('VerticalCoordinateSystem', {}).fetch('DepthSystemDefinition', {}).delete('DistanceUnits')
      unless depth_distance_units.nil?
        new_unit = depth_distance_units
        %w[Fathoms Feet HectoPascals Meters Millibars].each do |unit|
          new_unit = unit if unit.upcase == depth_distance_units.upcase
        end

        draft['SpatialInformation']['VerticalCoordinateSystem']['DepthSystemDefinition']['DistanceUnits'] = new_unit unless new_unit.nil?
      end

      # util/remove-empty-maps

      # (update-in [:SpatialExtent :VerticalSpatialDomains] spatial-conversion/drop-invalid-vertical-spatial-domains)
      # "Any VerticalSpatialDomain with a Type not in valid-vertical-spatial-domain-types
      # is not considered valid according to UMM spec v1.10.0 and should be dropped.
      # This behavior will eventually generate errors"

      # I don't think we should completely delete the VerticalSpatialDomain, we can just remove the Type field, schema validation will point out the missing field
      if draft.key? 'SpatialExtent'
        spatial_extent = draft['SpatialExtent']

        if spatial_extent.key? 'VerticalSpatialDomains'
          Array.wrap(spatial_extent['VerticalSpatialDomains']).each do |domain|
            new_type = domain['Type']
            ['Atmosphere Layer', 'Maximum Altitude', 'Maximum Depth', 'Minimum Altitude', 'Minimum Depth'].each do |type|
              new_type = type if type.upcase == new_type.upcase
            end

            domain['Type'] = new_type unless new_type.nil?
          end
        end
      end

      # char-data-type-normalization/migrate-up
      # Update Characteristics DataType to enum
      # https://github.com/nasa/Common-Metadata-Repository/blob/90faf9615e81ee9eccf69e362d09d6e5884d90ec/umm-spec-lib/src/cmr/umm_spec/xml_to_umm_mappings/characteristics_data_type_normalization.clj#L69
      # Platforms, Instruments, and ComposedOf/InstrumentChild
      if draft.key? 'Platforms'
        Array.wrap(draft['Platforms']).each do |platform|
          update_characteristics_data_type(platform)

          instruments = platform.fetch('Instruments', [])
          Array.wrap(instruments).each do |instrument|
            update_characteristics_data_type(instrument)

            instrument_children = instrument.fetch('ComposedOf', [])
            Array.wrap(instrument_children).each do |instrument_child|
              update_characteristics_data_type(instrument_child)
            end
          end
        end
      end

      # doi/migrate-missing-reason-up
      if draft.key? 'DOI'
        unless draft['DOI']['DOI']
          draft['DOI'] ||= {}
          draft['DOI']['MissingReason'] = 'Not Applicable'
        end
      end

      # (update-in-each [:PublicationReferences] related-url/migrate-online-resource-up)
      # (update-in-each [:CollectionCitations] related-url/migrate-online-resource-up)
      # "Migrate online-resource from version 1.9 to 1.10.
      # Need to remove Name and Description if their values are util/not-provided
      # because they are artificially added when migrating from 1.10 to 1.9."
      # N/A for MMT drafts

      # Update UseConstraints
      if draft.key? 'UseConstraints'
        use_constraints = draft['UseConstraints']
        draft['UseConstraints'] = { 'Description' => { 'Description' => use_constraints } }
      end

      d.draft = draft
      d.save
    end
  end

  def update_characteristics_data_type(object)
    characteristics = object['Characteristics']
    return if characteristics.nil?

    new_characteristics = []
    Array.wrap(characteristics).each do |characteristic|
      if characteristic['DataType'] && %w[STRING FLOAT INT BOOLEAN DATE TIME DATETIME DATE_STRING TIME_STRING DATETIME_STRING].include?(characteristic['DataType'].upcase)
        characteristic['DataType'] = characteristic['DataType'].upcase
      end
      new_characteristics << characteristic
    end

    object['Characteristics'] = new_characteristics
  end
end
