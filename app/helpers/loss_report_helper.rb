module LossReportHelper

  def cmr_client
    Cmr::Client.client_for_environment(Rails.configuration.cmr_env, Rails.configuration.services)
  end

  def token
    if session[:login_method] == 'launchpad'
      session[:launchpad_cookie]
    elsif session[:login_method] == 'urs'
      session[:access_token]
    end
  end

  def loss_report_output(hide_items=true, disp='text')
    # depending on the input selection (json or text) a comparison string/hash is created and displayed in-browser

    # @collection_error is true if there is an error in the translation that is performed by prepare_collections in the collections_controller
    if !@collection_error
      orig_xml,conv_xml = @original_collection_native_xml, @translated_collection_native_xml
      orig_h,conv_h  = @original_collection_native_hash, @translated_collection_native_hash
    else
      return 'Failure to get_concept or translate_collection' if disp == 'text'
      return {"error"=>"Failure to get_concept or translate_collection"} if disp == 'json'
    end

    # ISO and DIF collections (in XML form) contain namespaces that cause errors in the below comparison.
    # Specifically, when nodes are evaluated individually, (their namespace definitions remaining at the top of the xml)
    # their prefixes are undefined in the scope of the evaluation and therefore raise errors. Removing the namespaces
    # eliminates this issue.
    if @content_type.include?('iso') || @content_type.include?('dif')
      orig = Nokogiri::XML(orig_xml) { |config| config.strict.noblanks } .remove_namespaces!
      conv = Nokogiri::XML(conv_xml) { |config| config.strict.noblanks } .remove_namespaces!
    else
      orig = Nokogiri::XML(orig_xml) { |config| config.strict.noblanks }
      conv = Nokogiri::XML(conv_xml) { |config| config.strict.noblanks }
    end

    arr_paths = Array.new # This array is used to keep track of the paths that lead to arrays that have already been mapped
    text_output = String.new if disp == 'text'
    json_output = Hash.new if disp == 'json'

    # json_output['orig'] = hash_map(orig_h) if disp == 'json'
    # json_output['orig'] = orig_h if disp == 'json'
    # json_output['conv'] = conv_h if disp == 'json'
    # text_output += orig_xml if disp == 'text'

    json_output['format'] = @content_type if disp == 'json'
    text_output += (@content_type + "\n\n") if disp == 'text'

    orig.diff(conv, {:added => true, :removed => true}) do |change,node|
      element = node.to_xml
      path = node.parent.path.split('[')[0]
      arr_path = top_level_arr_path(path, orig_h, conv_h)

      if arr_path && path_not_checked?(arr_path, arr_paths)
        arr_paths << arr_path
        array_comparison(arr_path, orig_h, conv_h).each { |item| add_to_report(item[0], item[1], item[2], hide_items, disp, json_output, text_output) }
      elsif path_not_checked?(path, arr_paths) # nokogiri
        if is_xml?(node)
          element = Hash.from_xml(element)
          hash_map(element).each do |item|
            arr_path = top_level_arr_path("#{path}/#{item['path']}", orig_h, conv_h)
            if arr_path && path_not_checked?("#{path}/#{item['path']}", arr_paths) # all list
              if path_not_checked?(arr_path, arr_paths)
                arr_paths << arr_path
                array_comparison(arr_path, orig_h, conv_h).each { |item| add_to_report(item[0], item[1], item[2], hide_items, disp, json_output, text_output) }
              end
            elsif path_not_checked?("#{path}/#{item['path']}", arr_paths)
              add_to_report(change, item['value'], "#{path}/#{item['path']}", hide_items, disp, json_output, text_output)
            end
          end
        elsif (attr,val = is_attribute?(node))
          add_to_report(change, val, "#{path}/#{attr}" , hide_items, disp, json_output, text_output)
        else
          add_to_report(change, element, path, hide_items, disp, json_output, text_output)
        end
      end
    end
    return text_output if disp == 'text'
    return json_output if disp == 'json'
  end

  def is_xml?(node)
    # checks if the node being passed is xml
    # may be beneficial to add more checks
    node.to_xml.include?('<' && '</' && '>') ? true : false
  end

  def is_attribute?(node)
    # this method checks if the node being passed is an attribute change;
    # TODO: it may be beneficial to add more conditions to improve accuracy
    if node.to_xml.include?('=') && !node.to_xml.include?(' = ')
      attr_val = Array.new
      node.to_xml.split('=').each {|item| attr_val << item.strip.delete('\\"')}
      attr_val
    else
      false
    end
  end

  def path_not_checked?(arr_path, arr_paths)
    # this method checks the arr_paths array to see if the path being added to
    # the report has already been previously evaluated and added
    arr_paths.each { |path| return false if arr_path.include?(path) }
    true
  end

  def top_level_arr_path(path, orig_h, conv_h)
    # if an array is passed that passes through an array ie. /Contacts/Contact[0]/Role/Name
    # this method would return /Contacts/Contact because Contact is the outermost array (or false if the path doesn't contain an array)
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
      return "#{pre_translation_path}/#{pre_translation_array.keys[0]}"
    elsif post_translation_array.is_a?(Hash) && post_translation_array.keys.length == 1 && post_translation_array[post_translation_array.keys[0]].is_a?(Array)
      return "#{post_translation_path}/#{post_translation_array.keys[0]}"
    end
    path_contains_array = false
  end

  def add_to_report(change, element, path, hide_items, disp, json_output, text_output)
    @counter ||= 0 and @counter += 1
    # this function serves to preclude complex nests from forming in loss_report_output the
    # following 'if' structure is intended to increase readability by eliminating nests
    return text_output.concat("#{@counter}.".ljust(4)+"#{change}: #{element}".ljust(60) + path + "\n") if hide_items == false && disp == 'text'
    return text_output.concat("#{@counter}.".ljust(4)+"#{change}: ".ljust(3) + path + "\n") if hide_items == true && disp == 'text'
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
