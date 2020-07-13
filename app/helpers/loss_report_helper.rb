module LossReportHelper

  def prepare_collections(concept_id, format, umm_c_version)
    # TODO: need to add exception handling for get_concept, translate_collection
    original_collection_xml = cmr_client.get_concept(concept_id,token, {})
    original_collection_hash = Hash.from_xml(original_collection_xml.body)
    translated_collection_umm = cmr_client.translate_collection(original_collection_xml.body, "application/#{format}+xml", "application/vnd.nasa.cmr.umm+json;version=#{umm_c_version}", skip_validation=true)
    translated_collection_xml = cmr_client.translate_collection(translated_collection_umm.body.to_json, "application/vnd.nasa.cmr.umm+json;version=#{umm_c_version}", "application/#{format}+xml",  skip_validation=true)
    translated_collection_hash = Hash.from_xml(translated_collection_xml.body)
    return original_collection_xml.body, translated_collection_xml.body 
  end

  def path_leads_to_list?(path, org_hash, conv_hash)
    org_hash_path = hash_navigation(path, org_hash)
    conv_hash_path = hash_navigation(path, conv_hash)

    if org_hash_path == 'flag' || conv_hash_path == 'flag'
      return false
    end

    if path.include?("[") && path.include?("]")
      bool = true
    elsif org_hash_path.is_a?(Hash) && conv_hash_path.is_a?(Hash)
      org_hash_path.keys.each { |key| bool = true; break if org_hash_path[key].is_a?(Array) }
      conv_hash_path.keys.each { |key| bool = true; break if conv_hash_path[key].is_a?(Array) }
    elsif org_hash_path.is_a?(Array) || conv_hash_path.is_a?(Array)
      bool = true
    else
      bool = false
    end
    bool
  end

  def hash_navigation(dir, hash)
    dir = dir.split("/")
    if dir.is_a? Array
      dir.each do |key|
        if !key.empty? && hash.is_a?(Hash)
          hash = hash[key]
        elsif hash.is_a? Array
          return 'flag'
        end
      end
    else
      hash = hash[dir]
    end
    hash
  end

  def get_list_paths(dif_hash, original, converted)
    values_list = hash_to_list_of_values(dif_hash)
    paths = Array.new

    for item in values_list
      org_path = get_dir(item, original)
      conv_path = get_dir(item, converted)

      if org_path.include? "[]"
        path = org_path
      elsif conv_path.include? "[]"
        path = conv_path
      else
        path = org_path #arbitrary
      end

      if path.include? "[]"
        path = path.split "[]"
        paths << path[0] unless paths.any? { |p| p.eql? path[0] }
      elsif path_leads_to_list?(path, original, converted)
        paths << path unless paths.any? { |p| p.eql? path }
      end
    end
    paths
  end

  def compare_arrays(diff_hash, original_hash, converted_hash)
    dif_hash = diff_hash.clone
    original = original_hash.clone
    converted = converted_hash.clone
    paths = get_list_paths(dif_hash, original, converted)

    paths.each do |path|
      org_array = hash_navigation(path, original)
      org_arr = org_array.clone
      conv_array = hash_navigation(path, converted)
      conv_arr = conv_array.clone

      org_arr = Array.wrap(org_arr) unless org_arr.is_a?(Array)
      org_array = Array.wrap(org_array) unless org_array.is_a?(Array)
      conv_arr = Array.wrap(conv_arr) unless conv_arr.is_a?(Array)
      conv_array = Array.wrap(conv_array) unless conv_array.is_a?(Array)

      for conv_item in conv_array
        for org_item in org_array
          if org_item.eql? conv_item
            org_arr.delete(org_item)
            break
          end
        end
      end

      for org_item in org_array
        for conv_item in conv_array
          if org_item.eql? conv_item
            conv_arr.delete(conv_item)
            break
          end
        end
      end

      org_arr.each do |item|
        path_with_index = path + "[#{org_array.index(item)}]"
        puts "-: ".ljust(60) + path_with_index
      end

      conv_arr.each do |item|
        path_with_index = path + "[#{conv_array.index(item)}]"
        puts "+: ".ljust(60) + path_with_index #THIS INDEX DOESN'T MAKE SENSE
      end
    end
  end

  def find_difference_bt_hash_arrays(org_arr, conv_arr)
    org = org_arr.clone
    conv = conv_arr.clone
    missing = Array.new
    if org.eql? conv
      return missing
    else
      for conv_item in conv
        for org_item in org
          if org_item.eql? conv_item
            org.delete(conv_item)
            break
          end
        end
      end
      missing += org
    end
    missing
  end

  def find_difference_bt_hashes(org, conv)
    missing = Hash.new
    if org.eql? conv
      return missing
    else
      org.each do |org_key,org_value|
        conv_value = conv[org_key]
        if conv.key? org_key
          if conv_value.eql? org_value
            next
          elsif org_value.is_a?(Hash) && conv_value.is_a?(Hash)
            missing_value = find_difference_bt_hashes(org_value, conv_value)
            unless missing_value.empty?
              missing[org_key] = missing_value
            end
          elsif org_value.is_a?(Array) && conv_value.is_a?(Array)
            missing_value = find_difference_bt_hash_arrays(org_value, conv_value)
            unless missing_value.empty?
              missing[org_key] = missing_value
            end
          else
            missing[org_key] = org_value
          end
        else
          missing[org_key] = org_value
        end
      end
    end
    missing
  end

  def get_dir(value, hash_or_arr)
    iterable = hash_or_arr.clone
    dir = String.new
    if iterable.is_a? Hash
      unless iterable.key(value).nil?
        matching_key = iterable.key(value)
        dir += '/' + matching_key
        iterable.delete(matching_key)
        return dir
      else
        iterable.each do |key,val|
          if val.is_a?(Hash) && hash_to_list_of_values(val).include?(value)
            dir += '/' + key
            dir += get_dir(value, val)
            return dir
          elsif val.is_a?(Array) && array_to_list_of_values(val).include?(value)
            dir += '/' + key + "[]"
            dir += get_dir(value, val)
            return dir
          elsif val.eql? value
            dir += '/' + key
            iterable.delete(key)
            return dir
          end
        end
      end
    elsif iterable.is_a? Array
      iterable.each do |item|
        if item.is_a?(Hash) && hash_to_list_of_values(item).include?(value)
          dir += get_dir(value,item)
          return dir
        elsif item.is_a?(Array) && array_to_list_of_values(item).include?(value)
          dir += get_dir(value,item) + "[]"
          return dir
        end
      end
    end
    dir
  end

  def hash_to_list_of_values(hash)
    list = Array.new
    for val in hash.values
      if val.is_a? Hash
        list += hash_to_list_of_values(val)
      elsif val.is_a? Array
        list += array_to_list_of_values(val)
      else
        list << val
      end
    end
    list
  end

  def array_to_list_of_values(array)
    ls = Array.new
    for item in array
      if item.is_a? Hash
        ls += hash_to_list_of_values(item)
      elsif item.is_a? Array
        ls += array_to_list_of_values(item)
      else
        ls << item
      end
    end
    ls
  end
end
