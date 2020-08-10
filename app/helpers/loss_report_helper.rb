module LossReportHelper

  def loss_report_output(compared_collections: compared_collections, hide_items: true, display: 'text')
    # depending on the input selection (json or text) a comparison string/hash is created and displayed in-browser
    # this display feature could be a good candidate for dependency injection

    orig_h = compared_collections[:original_collection_native_hash]
    conv_h = compared_collections[:translated_collection_native_hash]

    # ISO and DIF collections (in XML form) contain namespaces that cause errors in the below comparison.
    # Specifically, when nodes are evaluated individually, (their namespace definitions remaining at the top of the xml)
    # their prefixes are undefined in the scope of the evaluation and therefore raise errors. Removing the namespaces
    # eliminates this issue.
    if compared_collections[:native_format].include?('iso') || compared_collections[:native_format].include?('dif')
      orig = Nokogiri::XML(compared_collections[:original_collection_native_xml]) { |config| config.strict.noblanks }.remove_namespaces!
      conv = Nokogiri::XML(compared_collections[:translated_collection_native_xml]) { |config| config.strict.noblanks }.remove_namespaces!
    else
      orig = Nokogiri::XML(compared_collections[:original_collection_native_xml]) { |config| config.strict.noblanks }
      conv = Nokogiri::XML(compared_collections[:translated_collection_native_xml]) { |config| config.strict.noblanks }
    end

    # This array is used to keep track of the paths that lead to arrays that have already been mapped
    arr_paths = Array.new

    if display == 'text'
      text_output = String.new and json_output = nil
      text_output += (compared_collections[:native_format] + "\n\n")
    elsif display == 'json'
      json_output = Hash.new and text_output = nil
      json_output['format'] = compared_collections[:native_format]
    end

    # Below is the Nokogiri#diff method that is used to compare Nokogiri::XML objects.
    # The 'change' item is either '+' or '-'; the 'node' item is the Nokogiri::XML::Node object
    orig.diff(conv, {:added => true, :removed => true}) do |change,node|

      element = node.to_xml
      path = node.parent.path.split('[')[0]
      arr_path = top_level_arr_path(path, orig_h, conv_h)

      # the first layer of the following if/else structure is used to separately evaluate explicit array changes.
      # This is why arr_path will evaluate true if the element in question is an array
      if arr_path && path_not_checked?(arr_path, arr_paths)
        arr_paths << arr_path
        array_comparison(arr_path, orig_h, conv_h).each { |item| add_to_report(item[0], item[1], item[2], hide_items, display, json_output, text_output) }
      elsif path_not_checked?(path, arr_paths)
        # this layer of if/else separates items that contain xml (this is a nokogiri oddity that occurs where
        # Nokogiri does not directly map to an item that is changed thus it still contains xml - this is the
        # purpose of hash_values_and_paths), items that represent xml attribute changes, and normal changes.
        if is_xml?(element)
          element = Hash.from_xml(element)
          hash_values_and_paths(element).each do |item|
            arr_path = top_level_arr_path("#{path}/#{item['path']}", orig_h, conv_h)
            # this layer of if/else structure is used to separately evaluate implicit array changes in the xml.
            # This is why arr_path will evaluate true if the element in question is an array
            if arr_path && path_not_checked?("#{path}/#{item['path']}", arr_paths)
              if path_not_checked?(arr_path, arr_paths)
                arr_paths << arr_path
                array_comparison(arr_path, orig_h, conv_h).each { |item| add_to_report(item[0], item[1], item[2], hide_items, display, json_output, text_output) }
              end
            elsif path_not_checked?("#{path}/#{item['path']}", arr_paths)
              add_to_report(change, item['value'], "#{path}/#{item['path']}", hide_items, display, json_output, text_output)
            end
          end
        elsif (attr,val = is_attribute?(element))
          add_to_report(change, val, "#{path}/#{attr}" , hide_items, display, json_output, text_output)
        else
          add_to_report(change, element, path, hide_items, display, json_output, text_output)
        end
      end
    end
    return text_output if display == 'text'
    return json_output if display == 'json'
  end

  def is_xml?(element)
    # checks if the element being passed is xml
    # may be beneficial to add more checks
    element.include?('<' && '</' && '>')
  end

  def is_attribute?(element)
    # this method checks if the element being passed is an attribute change;
    # TODO: it may be beneficial to add more conditions to improve accuracy
    if element.include?('=') && !element.include?(' = ')
      attr_val = Array.new
      element.split('=').each {|item| attr_val << item.strip.delete('\\"')}
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

    # the following line handles a scenario where hash_navigation returns false for both pre_ and post_translation_arrays
    # which means that the path passed does not exist in the original or converted collections
    return path_exists = false if pre_translation_array == false && post_translation_array == false

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

  def add_to_report(change, element, path, hide_items, display, json_output, text_output)
    @counter ||= 0 and @counter += 1
    # this function serves to preclude complex nests from forming in loss_report_output the
    # following 'if' structure is intended to increase readability by eliminating nests
    return text_output.concat("#{@counter}.".ljust(4)+"#{change}: #{element}".ljust(60) + path + "\n") if hide_items == false && display == 'text'
    return text_output.concat("#{@counter}.".ljust(4)+"#{change}: ".ljust(3) + path + "\n") if hide_items == true && display == 'text'
    return json_output["#{@counter}. #{change}: #{path}"] = element if display == 'json'
  end

  def hash_values_and_paths(hash)
    buckets = Array.new
    hash.each do |key,val|
      if val.is_a? Hash then hash_values_and_paths(val).each do |item|
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
