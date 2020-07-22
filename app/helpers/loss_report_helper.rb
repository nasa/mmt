module LossReportHelper

  def loss_report_output(concept_id, hide_items=true, disp='text')
    # depending on the input selection (json or text) a comparison string/hash is created and displayed in-browser
    orig_xml,conv_xml,orig_h,conv_h,content_type = prepare_collections(concept_id, '1.15.3')

    if content_type.include?('dif10')
      orig = Nokogiri::XML(orig_xml) { |config| config.strict.noblanks } .remove_namespaces!
      conv = Nokogiri::XML(conv_xml) { |config| config.strict.noblanks } .remove_namespaces!
    else
      orig = Nokogiri::XML(orig_xml) { |config| config.strict.noblanks }
      conv = Nokogiri::XML(conv_xml) { |config| config.strict.noblanks }
    end

    ignored_paths = Array.new # This array is used to keep track of the paths that lead to arrays that have already been mapped
    comparison_string = String.new if disp == 'text'
    comparison_hash = Hash.new if disp == 'json'

    # comparison_hash['orig'] = hash_map(orig_h) if disp == 'json'
    # comparison_hash['orig'] = orig_h if disp == 'json'
    # comparison_hash['conv'] = conv_h if disp == 'json'
    # comparison_string += orig_xml if disp == 'text'

    # p = '/DIF'
    # comparison_string += path_leads_to_array?(p, orig_h, conv_h).to_s + "\n\n" if disp == 'text'

    comparison_hash['format'] = content_type if disp == 'json'
    comparison_string += (content_type + "\n\n") if disp == 'text'

    counter = 1
    orig.diff(conv, {:added => true, :removed => true}) do |change,node|
      element = node.to_xml
      path = node.parent.path.split('[')[0]
      # comparison_string += (path + "\n") if disp == 'text'

      # need to check for lists in hash_map obj
      # need to solve problem where noko cherry picks an item out of a list (giving no indication it is a list; ie. Extended_metadata, related_URL)

      if path_leads_to_array?(path, orig_h, conv_h) && !ignored_paths.include?(path) # all lists
        ignored_paths << path
        array_comparison(path, orig_h, conv_h).each do |item|
          add_to_report(counter, 'c'+item[0], item[1], item[2], hide_items, disp, comparison_hash, comparison_string)
          counter += 1
        end
      elsif !ignored_paths.include?(path) # nokogiri
        if is_xml?(node) #Possibly use the nokogiri #xml? method
          element = Hash.from_xml(element)

          hash_map(element).each do |item|
            if path_leads_to_array?(path +'/'+ item['path'], orig_h, conv_h) && !ignored_paths.include?(path +'/'+ item['path']) # all lists
              # hash_navigation(path+'/'+ item['path'], orig_h).is_a?(Array) ? arr_path = hash_navigation(path+'/'+ item['path'], orig_h, return_path=true) : arr_path = hash_navigation(path+'/'+ item['path'], conv_h, return_path=true)
              arr_path = hash_navigation(path +'/'+ item['path'],orig_h,return_path=true) if hash_navigation(path +'/'+ item['path'], orig_h).is_a?(Array)
              arr_path = hash_navigation(path +'/'+ item['path'],conv_h,return_path=true) if hash_navigation(path +'/'+ item['path'], conv_h).is_a?(Array)

              if !ignored_paths.include?(arr_path)
                ignored_paths << arr_path
                array_comparison(arr_path, orig_h, conv_h).each do |item|
                  add_to_report(counter, 'cc'+item[0], item[1], item[2], hide_items, disp, comparison_hash, comparison_string)
                  counter += 1
                end
              end

            else
              add_to_report(counter, 'ct'+change, item['value'], path +'/'+ item['path'], hide_items, disp, comparison_hash, comparison_string)
              counter += 1
            end

          end
        else
          add_to_report(counter, change, element, path, hide_items, disp, comparison_hash, comparison_string)
          counter += 1
        end
      end
    end

    counter = 0
    comparison_string += "\n\n\n\n#{JSON.pretty_generate(orig_h)}\n\n\n\n#{JSON.pretty_generate(conv_h)}" if disp == 'text'
    # orig.diff(conv, {:added => true, :removed => true}) do |change,node|
    #   add_to_report(counter, change, node.to_xml, node.parent.path, false, disp, comparison_hash, comparison_string)
    #   counter += 1
    # end

    if disp == 'text' then return comparison_string
    elsif disp == 'json' then return comparison_hash end
  end

  def add_to_report(counter, change, element, path, hide_items, disp, comparison_hash, comparison_string)
    # this function serves to preclude complex nests from forming in loss_report_output the
    # following 'if' structure is intended to increase readability by eliminating nests
    return comparison_string.concat("#{counter}.".ljust(4)+"#{change}: #{element}".ljust(60) + path + "\n") if hide_items == false && disp == 'text'
    return comparison_string.concat("#{counter}.".ljust(4)+"#{change}: ".ljust(3) + path + "\n") if hide_items == true && disp == 'text'
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

  def path_leads_to_array?(path, org_hash, conv_hash)
    # this method takes a path string (and the full original and converted hashes) and outputs true if the path string contains a list; else false
    org_hash = hash_navigation(path, org_hash)
    conv_hash = hash_navigation(path, conv_hash)

    # if path == '/DIF/Related-URL' then byebug end
    bool = false
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
    # if bool == nil then bool = 'flag' end #THIS NEEDS TO BE EVALUATED
    bool
  end

  def hash_navigation(path, hash, return_path=false)
    # Passed a path string and the hash being navigated. This method parses the path string and
    # returns the array/value at the end of the path
    current_path = String.new
    path.split('/').each do |key|
      if hash.is_a?(Array)
        return hash if return_path == false
        return current_path if return_path == true
      elsif hash.key?(key) && hash.is_a?(Hash)
        current_path += "/#{key}"
        hash = hash[key]
      elsif !hash.key?(key) && key != ''
        return path_exists = false
      end
    end
    return hash if return_path == false
    return current_path if return_path == true
  end

  def array_comparison(path, original_hash, converted_hash)

    pre_translation_array = hash_navigation(path, original_hash)
    post_translation_array = hash_navigation(path, converted_hash)

    pre_translation_array == false ? pre_translation_array = Array.new : pre_translation_array = Array.wrap(pre_translation_array)
    post_translation_array == false ? post_translation_array = Array.new : post_translation_array = Array.wrap(post_translation_array)

    output = Array.new
    (pre_translation_array - post_translation_array).each do |item|
      path_with_index = path + "[#{pre_translation_array.index(item)}]"
      output << ['-', item, path_with_index]
    end

    (post_translation_array - pre_translation_array).each do |item|
      path_with_index = path + "[#{post_translation_array.index(item)}]"
      output << ['+', item, path_with_index]
    end
    output
  end
end
