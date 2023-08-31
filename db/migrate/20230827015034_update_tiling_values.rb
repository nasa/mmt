class UpdateTilingValues < ActiveRecord::Migration[6.1]
  def up
    metadata_specification = {
      'URL' => "https://cdn.earthdata.nasa.gov/umm/collection/v1.17.3",
      'Name' => "UMM-C",
      'Version' => "1.17.3"
    }
    collection_drafts = CollectionDraft.where.not(draft: {})
    proposals = CollectionDraftProposal.where.not(draft: {})
    templates = CollectionTemplate.where.not(draft: {})
    records = collection_drafts + proposals + templates

    records.each do |record|
      draft = record.draft
      if draft['MetadataSpecification'].present?
        draft['MetadataSpecification'] = metadata_specification
        record.save
      end

      # We need to convert min/max values to numbers, unless we are military grid system
      if draft['TilingIdentificationSystems'].present?
        systems = Array.wrap(draft['TilingIdentificationSystems'])
        systems.each do |object|
          value = object.dig('TilingIdentificationSystemName')
          if !value.nil? and value != 'Military Grid Reference System'
            coord1_min = object.dig('Coordinate1', 'MinimumValue')
            coord1_max = object.dig('Coordinate1', 'MaximumValue')
            coord2_min = object.dig('Coordinate2', 'MinimumValue')
            coord2_max = object.dig('Coordinate2', 'MaximumValue')
            object['Coordinate1']['MinimumValue'] = convert_to_number(coord1_min) unless coord1_min.nil?
            object['Coordinate1']['MaximumValue'] = convert_to_number(coord1_max) unless coord1_max.nil?
            object['Coordinate2']['MinimumValue'] = convert_to_number(coord2_min) unless coord2_min.nil?
            object['Coordinate2']['MaximumValue'] = convert_to_number(coord2_max) unless coord2_max.nil?
          end
        end
        draft['TilingIdentificationSystems'] = systems
        record.draft = draft
        record.save
      end
    end
  end

  def down
    metadata_specification = {
      'URL' => "https://cdn.earthdata.nasa.gov/umm/collection/v1.17.2",
      'Name' => "UMM-C",
      'Version' => "1.17.2"
    }
    collection_drafts = CollectionDraft.where.not(draft: {})
    proposals = CollectionDraftProposal.where.not(draft: {})
    templates = CollectionTemplate.where.not(draft: {})
    records = collection_drafts + proposals + templates

    records.each do |record|
      draft = record.draft
      if draft['MetadataSpecification'].present?
        draft['MetadataSpecification'] = metadata_specification
        record.save
      end

      # We need to convert min/max values back to strings, unless we are military grid system
      if draft['TilingIdentificationSystems'].present?
        systems = Array.wrap(draft['TilingIdentificationSystems'])
        systems.each do |object|
          value = object.dig('TilingIdentificationSystemName')
          if !value.nil? and value != 'Military Grid Reference System'
            coord1_min = object.dig('Coordinate1', 'MinimumValue')
            coord1_max = object.dig('Coordinate1', 'MaximumValue')
            coord2_min = object.dig('Coordinate2', 'MinimumValue')
            coord2_max = object.dig('Coordinate2', 'MaximumValue')
            object['Coordinate1']['MinimumValue'] = "#{coord1_min}" unless coord1_min.nil?
            object['Coordinate1']['MaximumValue'] = "#{coord1_max}" unless coord1_max.nil?
            object['Coordinate2']['MinimumValue'] = "#{coord2_min}" unless coord2_min.nil?
            object['Coordinate2']['MaximumValue'] = "#{coord2_max}" unless coord2_max.nil?
          end
        end
        draft['TilingIdentificationSystems'] = systems
        record.draft = draft
        record.save

      end
    end
  end

  def convert_to_number(string)
    return string if string.is_a? Numeric

    unless string.empty?
      stripped_string = string.delete(',')
      begin
        number = Float(stripped_string)
      rescue
        number = 0.0
      end
      number
    end
  end

end
