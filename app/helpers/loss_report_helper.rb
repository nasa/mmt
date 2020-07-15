module LossReportHelper

  def prepare_collections(concept_id, format, umm_c_version)
    # TODO: need to add exception handling for get_concept, translate_collection
    original_collection_native_xml = cmr_client.get_concept(concept_id,token, {})
    # concept ID and format can be scalped from headers etc
    original_collection_native_hash = Hash.from_xml(original_collection_native_xml.body)
    translated_collection_umm_json = cmr_client.translate_collection(original_collection_native_xml.body, "application/#{format}+xml", "application/vnd.nasa.cmr.umm+json;version=#{umm_c_version}", skip_validation=true)
    translated_collection_native_xml = cmr_client.translate_collection(translated_collection_umm_json.body.to_json, "application/vnd.nasa.cmr.umm+json;version=#{umm_c_version}", "application/#{format}+xml",  skip_validation=true)
    translated_collection_native_hash = Hash.from_xml(translated_collection_native_xml.body)
    # File.write('/Users/ctrummer/Documents/devtesting/o_'+concept_id+'.json', JSON.pretty_generate(original_collection_native_hash))
    # File.write('/Users/ctrummer/Documents/devtesting/c_'+concept_id+'.json', JSON.pretty_generate(translated_collection_native_hash))
    # File.write('/Users/ctrummer/Documents/devtesting/o_'+concept_id+'.xml', original_collection_native_xml.body)
    # File.write('/Users/ctrummer/Documents/devtesting/c_'+concept_id+'.xml', translated_collection_native_xml.body)
    return original_collection_native_xml.body, translated_collection_native_xml.body, original_collection_native_hash, translated_collection_native_hash
  end

  def path_leads_to_list?(path, org_hash, conv_hash)
    # this method takes a path string (and the full original and converted hashes) and outputs true if the path string contains a list; else false
    org_hash_path = hash_navigation(path, org_hash)
    conv_hash_path = hash_navigation(path, conv_hash)

    if path.include?("[") && path.include?("]")
      bool = true
    elsif org_hash_path.is_a?(Hash) && conv_hash_path.is_a?(Hash)
      bool = true if org_hash_path.keys.length == 1 && org_hash_path[org_hash_path.keys[0]].is_a?(Array)
      bool = true if conv_hash_path.keys.length == 1 && conv_hash_path[conv_hash_path.keys[0]].is_a?(Array)
    elsif org_hash_path.is_a?(Array) || conv_hash_path.is_a?(Array)
      bool = true
    else
      bool = false
    end
    bool
  end

  def hash_navigation(dir, hash)
    # Passed a path string and the hash being navigated. This method parses the path string and
    # returns the hash at the end of the path
    dir = dir.split '/'
    if dir.is_a? Array
      dir.each do |key|
        if !key.empty? && hash.is_a?(Hash)
          hash = hash[key]
        elsif hash.is_a? Array
          return hash
        end
      end
    else
      hash = hash[dir]
    end
    hash
  end

  def get_list_paths(dif_hash, original, converted)
    # arguments: differences hash, the original hash, and converted hash
    # Using these 3 hashses, all paths that lead to a list are returned as an array of path strings
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
        path = org_path
      end

      # the get_dir method includes a clause that 'tags' array-containing fields with '[]'
      # eg. '/Collection/Contacts/Contact[]/OrganizationEmails/Email'
      # the following lines show how this 'tagging' is used to identify an array in a given directory

      if path.include? "[]"
        path = path.split "[]"
        paths << path[0] unless paths.any? { |p| p.eql? path[0] }
      elsif path_leads_to_list?(path, original, converted)
        paths << path unless paths.any? { |p| p.eql? path }
      end
    end
    paths
  end

  def array_comparison(path, original_hash, converted_hash)
    # this is a 'less iterative' version of compare_arrays. Args: a single path, the original hash, and the converted hash.
    # Rather than finding all the array paths and using those to find the array differences, the array paths are individually
    # supplied by the nokogiri gem; this reduces redundancy
    org_array = hash_navigation(path, original_hash)
    conv_array = hash_navigation(path, converted_hash)

    org_array.is_a?(Array) ? org_arr = org_array.clone : org_arr = Array.wrap(org_array)
    org_array = Array.wrap(org_array) unless org_array.is_a?(Array)
    conv_array.is_a?(Array) ? conv_arr = conv_array.clone : conv_arr = Array.wrap(conv_array)
    conv_array = Array.wrap(conv_array) unless conv_array.is_a?(Array)

    for conv_item in conv_array
      for org_item in org_array
        if org_item.eql? conv_item
          org_arr.delete(org_item)
          conv_arr.delete(conv_item)
          break
        end
      end
    end

    output = Array.new
    org_arr.each do |item|
      path_with_index = path + "[#{org_array.index(item)}]"
      loss_item = ['-', item, path_with_index]
      output << loss_item
    end


    conv_arr.each do |item|
      path_with_index = path + "[#{conv_array.index(item)}]"
      loss_item = ['+', item, path_with_index]
      output << loss_item
    end
    output
  end

  def compare_arrays(original_hash, converted_hash, dh=false)
    # arguments: differences hash, the original hash, and converted hash
    # each path that leads to an array is used to navigate to that array and
    # subsequently compare the arrays in the original and converted hashes.
    # there is no usable ouput; there is printing to the terminal

    dh ? dif_hash = dh.clone : dif_hash = find_difference_bt_hashes(original_hash, converted_hash).clone
    original = original_hash.clone
    converted = converted_hash.clone
    paths = get_list_paths(dif_hash, original, converted)

    output = Array.new

    paths.each do |path|
      org_array = hash_navigation(path, original_hash)
      conv_array = hash_navigation(path, converted_hash)

      org_array.is_a?(Array) ? org_arr = org_array.clone : org_arr = Array.wrap(org_array)
      org_array = Array.wrap(org_array) unless org_array.is_a?(Array)
      conv_array.is_a?(Array) ? conv_arr = conv_array.clone : conv_arr = Array.wrap(conv_array)
      conv_array = Array.wrap(conv_array) unless conv_array.is_a?(Array)

      for conv_item in conv_array
        for org_item in org_array
          if org_item.eql? conv_item
            org_arr.delete(org_item)
            conv_arr.delete(conv_item)
            break
          end
        end
      end

      org_arr.each do |item|
        path_with_index = path + "[#{org_array.index(item)}]"
        puts "-: ".ljust(60) + path_with_index
        loss_item = ['-', path_with_index]
        output << loss_item
      end

      conv_arr.each do |item|
        path_with_index = path + "[#{conv_array.index(item)}]"
        puts "+: ".ljust(60) + path_with_index
        loss_item = ['+', path_with_index]
        output << loss_item
      end
    end
    output
  end

  def find_difference_bt_hash_arrays(org_arr, conv_arr)
    # array inputs; the output is an array that contains the items in the original array
    # that were not found in the converted array
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
    # input is the original hash and the converted hash; the output is the
    # 'differences hash' which represents the items in the original hash that were
    # not found in the converted hash
    missing = Hash.new
    if org.eql? conv
      return missing
    else
      org.each do |org_key,org_value|
        if (conv_value = conv[org_key])
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
    # passing the sought-after value and the hash or array being parsed
    # output: a single string representing the path to the value arg passed to this method
    iterable = hash_or_arr.clone
    dir = String.new
    if iterable.is_a? Hash
      if (matching_key = iterable.key(value))
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
    # converts a highly nested hash to a list of all its values
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
    #converts a highly nested array to a list of all its values
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
