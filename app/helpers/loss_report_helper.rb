module LossReportHelper

  def loss_report_output(concept_id, hide_items=true, disp='text')
    orig,conv,orig_h,conv_h = prepare_collections(concept_id, 'echo10', '1.15.3')
    orig = Nokogiri::XML(orig) { |config| config.strict.noblanks }
    conv = Nokogiri::XML(conv) { |config| config.strict.noblanks }

    ignored_paths = Array.new # This array is used to keep track of the paths that lead to arrays that have already been mapped
    comparison_string = String.new if disp == 'text'
    comparison_hash = Hash.new if disp == 'json'

    counter = 1
    orig.diff(conv, {:added => true, :removed => true}) do |change,node| 
      split_path = node.parent.path.split('[')
      if node.parent.path.include?('[') && !ignored_paths.include?(split_path[0])  #
        ignored_paths << split_path[0]
        array_comparison(split_path[0], orig_h, conv_h).each do |item|
          if disp == 'text'
            comparison_string += "#{counter}. #{item[0]}: #{item[1]}".ljust(60) + item[2] + "\n" if hide_items == false
            comparison_string += "#{counter}. #{item[0]}: ".ljust(2) + item[2] + "\n" if hide_items == true
          elsif disp == 'json'
            comparison_hash["#{counter}. #{item[0]}: #{item[2]}"] = item[1]
          end
          counter += 1
        end
      elsif !ignored_paths.include?(split_path[0]) && !path_leads_to_list?(node.parent.path, orig_h, conv_h)
        element = node.to_xml
        path = node.parent.path
        if disp == 'text'
          if element.include?('<' && '</' && '>')
            element = Hash.from_xml(element)
            hash_map(element).each do |item|
              comparison_string += "#{counter}. #{change}: #{item['value']}".ljust(60) + path + '/' + item['path'] + "\n" if hide_items == false
              comparison_string += "#{counter}. #{change}: ".ljust(2) + path + '/' + item['path'] + "\n" if hide_items == true
              counter += 1
            end
          else
            comparison_string += "#{counter}. #{change}: #{element}".ljust(60) + path + "\n" if hide_items == false
            comparison_string += "#{counter}. #{change}: ".ljust(2) + path + "\n" if hide_items == true
            counter += 1
          end
        elsif disp == 'json'
          if element.include?('<' && '</' && '>')
            element = Hash.from_xml(element)
            hash_map(element).each do |item|
              comparison_hash["#{counter}. #{change}: #{path + '/' + item['path']}"] = item['value']
              counter += 1
            end
          else
            comparison_hash["#{counter}. #{change}: #{path}"] = element
            counter += 1
          end
        end
      end
    end

    if disp == 'text'
      return comparison_string
    elsif disp == 'json'
      return comparison_hash
    end

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
      # the number of keys must be 1 because all arrays in echo10, dif10, and iso19115 are tagged similar to:
      # <Contacts><Contact>contact</Contact></Contacts> and so all array-containing tags will be the plural
      # of the array name. This clause serves to idenitfy array-containing tags when their paths aren't properly
      # displayed by nokogiri
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
    dir.each do |key|
      if !key.empty? && hash.is_a?(Hash)
        hash = hash[key]
      elsif hash.is_a? Array
        return hash
      end
    end
    hash
  end

  def array_comparison(path, original_hash, converted_hash)

    org_array = hash_navigation(path, original_hash)
    conv_array = hash_navigation(path, converted_hash)

    org_array.is_a?(Array) ? org_arr = org_array.clone : org_arr = Array.wrap(org_array)
    org_array = Array.wrap(org_array) unless org_array.is_a?(Array)
    conv_array.is_a?(Array) ? conv_arr = conv_array.clone : conv_arr = Array.wrap(conv_array)
    conv_array = Array.wrap(conv_array) unless conv_array.is_a?(Array)

    # org_arr and conv_arr are copies of org_array and conv_array, respectively.
    # The *_arr values are edited during the comparison between the org_array and conv_array arrays
    # and so the *_array arrays are used to maintained a full version of each array for indexing the items in the following lines.

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
end
