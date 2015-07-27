# TODO Move all markup out of this helper
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

  def display_key_value_pairs(value)
    list_key_values(value).flatten.compact.join(' | ')
  end

  def list_key_values(hash)
    # puts "HASH: #{hash.inspect}"
    hash.map do |key, value|
      if value.is_a? Hash
        list_key_values(value)
      else
        # TODO can this value improve?
          # Resource Provider instead of RESOURCEPROVIDER or Resourceprovider
        "#{key}: #{value}" unless value.empty?
      end
    end
  end

end
