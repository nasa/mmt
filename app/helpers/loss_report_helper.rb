module LossReportHelper

  def loss_report_output(concept_id, hide_items=true, disp='text')
    # depending on the input selection (json or text) a comparison string/hash is created and displayed in-browser

    orig_xml,conv_xml,orig_h,conv_h,content_type = prepare_collections(concept_id, '1.15.3')

    if content_type.include?('iso') || content_type.include?('dif')
      orig = Nokogiri::XML(orig_xml) { |config| config.strict.noblanks } .remove_namespaces!
      conv = Nokogiri::XML(conv_xml) { |config| config.strict.noblanks } .remove_namespaces!
    else
      orig = Nokogiri::XML(orig_xml) { |config| config.strict.noblanks }
      conv = Nokogiri::XML(conv_xml) { |config| config.strict.noblanks }
    end

    #write files to test that all changes are being found with opendiff
    dir = '/Users/ctrummer/Documents/devtesting'
    File.write("#{dir}/o_#{concept_id}.xml", orig.to_xml)
    File.write("#{dir}/c_#{concept_id}.xml", conv.to_xml)

    arr_paths = Array.new # This array is used to keep track of the paths that lead to arrays that have already been mapped
    text_output = String.new if disp == 'text'
    json_output = Hash.new if disp == 'json'

    # json_output['orig'] = hash_map(orig_h) if disp == 'json'
    # json_output['orig'] = orig_h if disp == 'json'
    # json_output['conv'] = conv_h if disp == 'json'
    # text_output += orig_xml if disp == 'text'

    json_output['format'] = content_type if disp == 'json'
    text_output += (content_type + "\n\n") if disp == 'text'

    # text_output += top_level_arr_path('/Collection/OnlineResources/OnlineResource', orig_h, conv_h).to_s+"\n"

    orig.diff(conv, {:added => true, :removed => true}) do |change,node|
      element = node.to_xml
      path = node.parent.path.split('[')[0]
      arr_path = top_level_arr_path(path, orig_h, conv_h)

      # FOR TROUBLESHOOTING -------------------------------------------------------------------------------------
      puts "---------------------------------------------------------------------------------"
      puts "arr_path: #{arr_path} ... node.parent.path: #{node.parent.path} ... path: #{path}"
      # FOR TROUBLESHOOTING -------------------------------------------------------------------------------------

      if arr_path && path_not_checked?(arr_path, arr_paths)

        # FOR TROUBLESHOOTING -------------------------------------------------------------------------------------
        puts "** path 1"
        puts "ar path_not_checked?(arr_path,arr_paths): #{path_not_checked?(arr_path,arr_paths).to_s}"
        # FOR TROUBLESHOOTING -------------------------------------------------------------------------------------

        arr_paths << arr_path
        array_comparison(arr_path, orig_h, conv_h).each do |item| # all lists
          add_to_report('ar'+item[0], item[1], item[2], hide_items, disp, json_output, text_output)
        end

        # FOR TROUBLESHOOTING -------------------------------------------------------------------------------------
        puts "arr_paths: #{arr_paths}"
        # FOR TROUBLESHOOTING -------------------------------------------------------------------------------------

      elsif path_not_checked?(path, arr_paths) # nokogiri

        # FOR TROUBLESHOOTING -------------------------------------------------------------------------------------
        puts "** path 2"
        puts "path_not_checked?(path,arr_paths): #{path_not_checked?(path,arr_paths).to_s}"
        # FOR TROUBLESHOOTING -------------------------------------------------------------------------------------

        if is_xml?(node)
          element = Hash.from_xml(element)
          hash_map(element).each do |item|
            arr_path = top_level_arr_path("#{path}/#{item['path']}", orig_h, conv_h)

            # FOR TROUBLESHOOTING -------------------------------------------------------------------------------------
            puts "path_not_checked?('path/item['path']}, arr_paths): #{path_not_checked?("#{path}/#{item['path']}", arr_paths)}"
            # FOR TROUBLESHOOTING -------------------------------------------------------------------------------------

            if arr_path && path_not_checked?("#{path}/#{item['path']}", arr_paths) # all list
              if path_not_checked?(arr_path, arr_paths)

                # FOR TROUBLESHOOTING -------------------------------------------------------------------------------------
                puts "na path_not_checked?(arr_path, arr_paths): #{path_not_checked?(arr_path, arr_paths)}"
                # FOR TROUBLESHOOTING -------------------------------------------------------------------------------------

                arr_paths << arr_path
                array_comparison(arr_path, orig_h, conv_h).each do |item|
                  add_to_report('na'+item[0], item[1], item[2], hide_items, disp, json_output, text_output)
                end

                # FOR TROUBLESHOOTING -------------------------------------------------------------------------------------
                puts "arr_paths: #{arr_paths}"
                # FOR TROUBLESHOOTING -------------------------------------------------------------------------------------

              end
            elsif path_not_checked?("#{path}/#{item['path']}", arr_paths)
              add_to_report('hn'+change, item['value'], "#{path}/#{item['path']}", hide_items, disp, json_output, text_output)
            end

              # FOR TROUBLESHOOTING -------------------------------------------------------------------------------------
              puts "arr_paths: #{arr_paths}"
              # FOR TROUBLESHOOTING -------------------------------------------------------------------------------------

          end
        else
          add_to_report('ng'+change, element, path, hide_items, disp, json_output, text_output)

          # FOR TROUBLESHOOTING -------------------------------------------------------------------------------------
          puts "arr_paths: #{arr_paths}"
          # FOR TROUBLESHOOTING -------------------------------------------------------------------------------------

        end
      end
    end
    if disp == 'text' then return text_output
    elsif disp == 'json' then return json_output end
  end

  def path_not_checked?(arr_path, arr_paths)
    arr_paths.each do |path|
      if arr_path.include?(path)
        return false
      end
    end
    true
  end

  def top_level_arr_path(path, orig_h, conv_h)
    pre_translation_array, pre_translation_path = hash_navigation(path, orig_h)
    post_translation_array, post_translation_path = hash_navigation(path, conv_h)

    return false if pre_translation_array == false && post_translation_array == false

    return pre_translation_path if pre_translation_array.is_a?(Array)
    return post_translation_path if post_translation_array.is_a?(Array)

    # the number of keys must be 1 because all arrays in echo10, dif10, and iso19115 are tagged similar to:
    # <Contacts><Contact>contact</Contact></Contacts> and so all array-containing tags will be the plural
    # of the array name. This clause serves to identify array-containing tags when their paths aren't properly
    # displayed by nokogiri
    if pre_translation_array.is_a?(Hash) && pre_translation_array.keys.length == 1 && pre_translation_array[pre_translation_array.keys[0]].is_a?(Array)
      return pre_translation_path + "/#{pre_translation_array.keys[0]}"
    elsif post_translation_array.is_a?(Hash) && post_translation_array.keys.length == 1 && post_translation_array[post_translation_array.keys[0]].is_a?(Array)
      return post_translation_path + "/#{post_translation_array.keys[0]}"
    end

    path_contains_array = false
  end

  def add_to_report(change, element, path, hide_items, disp, json_output, text_output)
    @counter ||= 0 and @counter += 1

    # this function serves to preclude complex nests from forming in loss_report_output the
    # following 'if' structure is intended to increase readability by eliminating nests
    return text_output.concat("#{@counter}.".ljust(4)+"#{change}: #{element}".ljust(60) + path + "\n") if hide_items == false && disp == 'text'
    puts "#{@counter}.".ljust(4)+"#{change}: ".ljust(3) + path; return text_output.concat("#{@counter}.".ljust(4)+"#{change}: ".ljust(3) + path + "\n") if hide_items == true && disp == 'text'
    return json_output["#{@counter}. #{change}: #{path}"] = element if disp == 'json'
  end

  def hash_map(hash)
    buckets = Array.new
    hash.each do |key,val|
      if val.is_a? Hash then hash_map(val).each do |item|
        item['path'] = key + '/' + item['path']
        buckets << item end
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


  def hash_navigation(path, hash)
    # Passed a path string and the hash being navigated. This method parses the path string and
    # returns the array/value at the end of the path
    current_path = String.new
    path.split('/').each do |key|
      if hash.is_a?(Array)
        return hash, current_path
      elsif hash.key?(key) && hash.is_a?(Hash)
        current_path += "/#{key}"
        hash = hash[key]
      elsif !hash.key?(key) && key != ''
        return path_exists = false, "#{current_path}/#{key}"
      end
    end
    return hash, current_path
  end

  def array_comparison(path, original_hash, converted_hash)
    pre_translation_array = hash_navigation(path, original_hash)[0]
    post_translation_array = hash_navigation(path, converted_hash)[0]

    pre_translation_array == false ? pre_translation_array = Array.new : pre_translation_array = Array.wrap(pre_translation_array)
    post_translation_array == false ? post_translation_array = Array.new : post_translation_array = Array.wrap(post_translation_array)

    output = Array.new
    (pre_translation_array - post_translation_array).each do |item|
      path_with_index = path + "[#{pre_translation_array.index(item)}]"
      # the following line is used to eliminate indexing confusion when there is more than one occurrence of a particular item in an array
      pre_translation_array[pre_translation_array.index(item)] = item.to_s + 'item indexed'
      output << ['-', item, path_with_index]
    end

    (post_translation_array - pre_translation_array).each do |item|
      path_with_index = path + "[#{post_translation_array.index(item)}]"
      # the following line is used to eliminate indexing confusion when there is more than one occurrence of a particular item in an array
      post_translation_array[post_translation_array.index(item)] = item.to_s + 'item indexed'
      output << ['+', item, path_with_index]
    end
    output
  end

end
