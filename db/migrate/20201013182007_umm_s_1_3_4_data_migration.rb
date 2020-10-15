class UmmS134DataMigration < ActiveRecord::Migration[5.2]
  def up
    drafts = ServiceDraft.where.not(draft: {})

    drafts.each do |draft|
      metadata = add_formats_to_reformatting(draft.draft)
      draft.draft = expand_subset_type(metadata)

      draft.save
    end
  end

  def down
    drafts = ServiceDraft.where.not(draft: {})

    drafts.each do |draft|
      metadata = reduce_subset_type(draft.draft)
      metadata = remove_new_service_type_enum(metadata)
      draft.draft = remove_new_reformatting_types(metadata)

      draft.save
    end
  end

  ###################### TO UMM-S 1.3.4 #########################
  # Adds input and output formattings to the supportedreformattings
  # Deletes old fields (SupportedInputFormats and SupportedOutputFormats) that
  # are no longer supported.
  # Overrides SupportedReformattings if it is not an array for some reason.
  def add_formats_to_reformatting(draft)
    return draft unless (options = draft.fetch('ServiceOptions', nil))
    # Delete the service options if they aren't a hash.
    unless options.is_a?(Hash)
      draft.delete('ServiceOptions')
      return draft
    end

    inputs = options.delete('SupportedInputFormats') || []
    outputs = options.delete('SupportedOutputFormats') || []

    # Need either inputs or outputs, but if both are present, both they need to
    # be arrays if present
    # If they are not arrays, they are bad data and cannot be used.
    return draft unless (inputs.present? && inputs.is_a?(Array) && outputs.present? && outputs.is_a?(Array)) ||
                        (inputs.present? && inputs.is_a?(Array) && outputs.blank?) ||
                        (outputs.present? && outputs.is_a?(Array) && inputs.blank?)

    reformattings = draft.fetch('ServiceOptions').fetch('SupportedReformattings', nil)
    reformattings = [] unless reformattings.is_a?(Array)
    if inputs.blank?
      reformattings.push('SupportedOutputFormats' => outputs)
      draft['ServiceOptions']['SupportedReformattings'] = reformattings
      return draft
    end

    if outputs.blank?
      inputs.each do |input|
        reformattings.push('SupportedInputFormat' => input)
      end
      draft['ServiceOptions']['SupportedReformattings'] = reformattings
      return draft
    end

    inputs.each do |input|
      if (index = find_first_reformatting(reformattings, input))
        reformattings[index]['SupportedOutputFormats'] |= outputs
      else
        reformattings.push('SupportedInputFormat' => input, 'SupportedOutputFormats' => outputs)
      end
    end

    draft['ServiceOptions']['SupportedReformattings'] = reformattings
    draft
  end

  def find_first_reformatting(reformattings, input_value)
    reformattings.each_with_index do |reformatting, index|
      return index if reformatting['SupportedInputFormat'] == input_value
    end
    nil
  end

  # Uses CMR's logic for the expansion, which is tailored to specific existing
  # without more guidance, it's hard/impossible to make a general migration here
  # Deletes old SubsetTypes field.
  def expand_subset_type(draft)
    # If ServiceOptions were malformed, the preceding action would remove it,
    # so this one does not need to validate the structure of it.
    return draft unless (subset_type = draft.fetch('ServiceOptions', {}).delete('SubsetTypes')) && subset_type.is_a?(Array)

    new_subset_type = {}
    if subset_type.include?('Spatial')
      if draft['Type'] == 'OPeNDAP' || draft['Type'] == 'THREDDS'
        new_subset_type['SpatialSubset'] = { 'BoundingBox' => { 'AllowMultipleValues' => false } }
      elsif draft['Type'] == 'ESI' || draft['Type'] == 'ECHO ORDERS'
        new_subset_type['SpatialSubset'] = {
                                             'BoundingBox' => { 'AllowMultipleValues' => false },
                                             'Shapefile' => [{'Format' => 'ESRI'}, {'Format' => 'KML'}, {'Format' => 'GeoJSON'}]
                                           }
      end
    end

    new_subset_type['TemporalSubset'] = { 'AllowMultipleValues' => false } if subset_type.include?('Temporal')

    if subset_type.include?('Variable')
      new_subset_type['VariableSubset'] = if ['OPeNDAP', 'THREDDS', 'ESI', 'ECHO ORDERS'].include?(draft['Type'])
                                            { 'AllowMultipleValues' => true }
                                          else
                                            { 'AllowMultipleValues' => false }
                                          end
    end

    draft['ServiceOptions']['Subset'] = new_subset_type
    draft
  end

  ###################### TO UMM-S 1.3.3 #########################
  def reduce_subset_type(draft)
    return draft unless (options = draft.fetch('ServiceOptions', nil))
    unless options.is_a?(Hash)
      draft.delete('ServiceOptions')
      return draft
    end
    return draft unless (subset = options.delete('Subset')) && subset.is_a?(Hash)

    old_subset_type = []
    old_subset_type << 'Spatial' if subset['SpatialSubset']
    old_subset_type << 'Temporal' if subset['TemporalSubset']
    old_subset_type << 'Variable' if subset['VariableSubset']

    draft['ServiceOptions']['SubsetTypes'] = old_subset_type
    draft
  end

  def remove_new_service_type_enum(draft)
    draft.delete('Type') if draft['Type'] == 'Harmony'
    draft
  end

  def remove_new_reformatting_types(draft)
    return draft unless (supported_reformattings = draft.fetch('ServiceOptions', {}).delete('SupportedReformattings')) && supported_reformattings.is_a?(Array)

    supported_reformattings.each do |reformatting|
      reformatting.delete('SupportedInputFormat') if reformatting['SupportedInputFormat'] == 'Shapefile+zip'
      reformatting['SupportedOutputFormats']&.delete('Shapefile+zip')
      reformatting.delete('SupportedOutputFormats') if reformatting['SupportedOutputFormats'].blank?
    end

    supported_reformattings.delete_if { |item| item == {} }
    draft['ServiceOptions']['SupportedReformattings'] = supported_reformattings
    draft
  end
end
