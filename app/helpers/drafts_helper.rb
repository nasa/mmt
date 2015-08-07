module DraftsHelper
  def construct_keyword_string(hash_obj, str)
    # Assumes hash is passed in as ordered
    hash_obj.each do |key, value|
      if value.is_a?(String)
        str << ' > ' if !str.blank?
        str = str << value
      else # Use tail recursion to construct the string found in the sub-hash
        str = construct_keyword_string(value, str)
      end
    end
    return str
  end

  # Takes a html element name (draft_metadata_lineage_index_role)
  # outputs a param name (draft[metadata_lineage][index][role])
  WORDS = ['metadata_lineage', 'organization_name', 'short_name', 'long_name', 'first_name', 'middle_name', 'last_name', 'service_hours', 'contact_instructions', 'street_address', 'state_province', 'postal_code', 'file_size', 'content_type', 'mime_type', 'related_url', 'distribution_size', 'distribution_format', 'distribution_media', 'temporal_extent', 'range_date_time', 'periodic_date_time', 'single_date_time', 'beginning_date_time', 'ending_date_time', 'start_date', 'end_date', 'period_cycle_duration_unit', 'period_cycle_duration_value', 'duration_unit', 'duration_value', 'precision_of_seconds', 'ends_at_present_flag', 'temporal_range_type', 'temporal_keyword', 'paleo_temporal_coverage', 'detailed_classification', 'chronostratigraphic_unit']
  def name_to_param(name)
    # convert good words to dashes
    # TODO is there a way to do this only if name includes a value within WORDS?
    WORDS.each do |word|
      name.gsub!(word, word.dasherize)
    end

    # split words on underscores, wrap in brackets, and convert good words back to underscores
    name = name.split('_').map.with_index do |word, index|
      word = word.gsub(/(?<!new)index/, '').underscore
      if index == 0
        word
      else
        "[#{word}]"
      end
    end

    # join wrapped words
    name.join
  end
end
