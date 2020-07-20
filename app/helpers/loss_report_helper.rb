module LossReportHelper

  def loss_report_output(concept_id, hide_items=true, disp='text')
    # depending on the input selection (json or text) a comparison string/hash is created and displayed in-browser
    orig,conv,orig_h,conv_h,ct = prepare_collections(concept_id, '1.15.3')

    orig = Nokogiri::XML(orig) { |config| config.strict.noblanks }
    conv = Nokogiri::XML(conv) { |config| config.strict.noblanks }

    ignored_paths = Array.new # This array is used to keep track of the paths that lead to arrays that have already been mapped
    comparison_string = String.new if disp == 'text'
    comparison_hash = Hash.new if disp == 'json'
    comparison_hash['format'] = ct
    comparison_string += (ct + "\n\n") if disp == 'text'

    counter = 1
    orig.diff(conv, {:added => true, :removed => true}) do |change,node|
      element = node.to_xml
      path = node.parent.path
      split_path = path.split('[')[0]

      if path.include?('[') && !ignored_paths.include?(split_path)
        ignored_paths << split_path
        array_comparison(split_path, orig_h, conv_h).each do |item|
          add_to_report(counter, item[0], item[1], item[2], hide_items, disp, comparison_hash, comparison_string)
          counter += 1
        end
      elsif !ignored_paths.include?(split_path) && !path_leads_to_list?(path, orig_h, conv_h)
        if is_xml?(node)
          element = Hash.from_xml(element)
          hash_map(element).each do |item|
            add_to_report(counter, change, item['value'], path +'/'+ item['path'], hide_items, disp, comparison_hash, comparison_string)
            counter += 1
          end
        else
          add_to_report(counter, change, element, path, hide_items, disp, comparison_hash, comparison_string)
          counter += 1
        end
      end

    end
    if disp == 'text' then return comparison_string
    elsif disp == 'json' then return comparison_hash end
  end

  def add_to_report(counter, change, element, path, hide_items, disp, comparison_hash, comparison_string)
    # this function serves to preclude complex nests from forming in loss_report_output the
    # following 'if' structure is intended to increase readability by eliminating nests
    return comparison_string.concat("#{counter}. #{change}: #{element}".ljust(60) + path + "\n") if hide_items == false && disp == 'text'
    return comparison_string.concat("#{counter}. #{change}: ".ljust(2) + path + "\n") if hide_items == true && disp == 'text'
    return comparison_hash["#{counter}. #{change}: #{path}"] = element if disp == 'json'
  end

  def hash_map(hash)
    buckets = Array.new
    hash.each do |key,val|
      if val.is_a? Hash
        hash_map(val).each do |item|
          item['path'] = key + '/' + item['path']
          buckets << item
        end
      else
        buckets << {'path'=> key, 'value'=> val}
      end
    end
    buckets
  end

  def is_xml?(node)
    if node.to_xml.include?('<' && '</' && '>') then return true
    else return false end
  end

  def prepare_collections(concept_id, umm_c_version)
    # TODO: need to add exception handling for get_concept, translate_collection
    original_collection_native_xml = cmr_client.get_concept(concept_id,token, {})
    content_type = original_collection_native_xml.headers.fetch('content-type').split(';')[0]
    original_collection_native_hash = Hash.from_xml(original_collection_native_xml.body)
    translated_collection_umm_json = cmr_client.translate_collection(original_collection_native_xml.body, content_type, "application/vnd.nasa.cmr.umm+json;version=#{umm_c_version}", skip_validation=true)
    translated_collection_native_xml = cmr_client.translate_collection(translated_collection_umm_json.body.to_json, "application/vnd.nasa.cmr.umm+json;version=#{umm_c_version}", content_type,  skip_validation=true)
    translated_collection_native_hash = Hash.from_xml(translated_collection_native_xml.body)
    return original_collection_native_xml.body, translated_collection_native_xml.body, original_collection_native_hash, translated_collection_native_hash, content_type
  end

  def path_leads_to_list?(path, org_hash, conv_hash)
    # this method takes a path string (and the full original and converted hashes) and outputs true if the path string contains a list; else false
    org_hash = hash_navigation(path, org_hash)
    conv_hash = hash_navigation(path, conv_hash)

    if path.include?("[") && path.include?("]")
      bool = true
    elsif org_hash.is_a?(Hash) && conv_hash.is_a?(Hash)
      # the number of keys must be 1 because all arrays in echo10, dif10, and iso19115 are tagged similar to:
      # <Contacts><Contact>contact</Contact></Contacts> and so all array-containing tags will be the plural
      # of the array name. This clause serves to identify array-containing tags when their paths aren't properly
      # displayed by nokogiri
      bool = true if org_hash.keys.length == 1 && org_hash[org_hash.keys[0]].is_a?(Array)
      bool = true if conv_hash.keys.length == 1 && conv_hash[conv_hash.keys[0]].is_a?(Array)
    elsif org_hash.is_a?(Array) || conv_hash.is_a?(Array)
      bool = true
    else
      bool = false
    end
    bool
  end

  def hash_navigation(path, hash)
    # Passed a path string and the hash being navigated. This method parses the path string and
    # returns the array/value at the end of the path
    path.split('/').each do |key|
      if hash.is_a?(Array)
        return hash
      elsif hash.key?(key) && hash.is_a?(Hash)
        hash = hash[key]
      end
    end
    hash
  end

  def array_comparison(path, original_hash, converted_hash)

    pre_translation_array = hash_navigation(path, original_hash)
    post_translation_array = hash_navigation(path, converted_hash)

    # in the case that a one-item array is parsed as a regular key-value pair instead of an array, an Array wrapper is placed around key-val pair
    # so that the following for loops can be executed without error
    pre_translation_array.is_a?(Array) ? lost_items_arr = pre_translation_array.clone : lost_items_arr = Array.wrap(pre_translation_array)
    pre_translation_array = Array.wrap(pre_translation_array)
    post_translation_array.is_a?(Array) ? added_itmes_arr = post_translation_array.clone : added_itmes_arr = Array.wrap(post_translation_array)
    post_translation_array = Array.wrap(post_translation_array)

    # as defined above, the lost_items_arr and added_itmes_arr are copies of pre_translation_array and post_translation_array, respectively.
    # The *_arr values are edited during the comparison between the pre_translation_array and post_translation_array arrays
    # and so the *_array arrays are used to maintain a full version of each array for indexing the items in the following lines.

    for conv_item in post_translation_array
      for org_item in pre_translation_array
        if org_item == conv_item
          lost_items_arr.delete(org_item)
          added_itmes_arr.delete(conv_item)
          break
        end
      end
    end

    output = Array.new
    lost_items_arr.each do |item|
      path_with_index = path + "[#{pre_translation_array.index(item)}]"
      output << ['-', item, path_with_index]
    end


    added_itmes_arr.each do |item|
      path_with_index = path + "[#{post_translation_array.index(item)}]"
      output << ['+', item, path_with_index]
    end
    output
  end
end
