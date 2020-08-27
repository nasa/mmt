require 'libxml_to_hash'

namespace :collection do
  desc 'Translate a collection from native format to UMM JSON and back to native format'
  task :loss, [:file, :format, :disp, :version] => :environment do |_task, args|
    args.with_defaults(:version => '1.15.3')
    args.with_defaults(:disp => 'show')

    abort 'FORMAT NOT SUPPORTED' unless args.format == 'echo10' || args.format == 'dif10' || args.format == 'iso19115' || args.format == 'iso:smap'

    filename = args.file.split('/')[-1]
    puts "\nTranslating #{filename} to UMM JSON..."

    # remove comments and unnecessary whitespace
    native_original_xml_noko = Nokogiri::XML(File.read(args.file)) { |config| config.strict.noblanks }
    native_original_xml_noko_obj.xpath('//comment()').remove
    native_original_hash = Hash.from_xml(native_original_xml_noko_obj.to_xml)

    #translate to UMM
    umm_response = cmr_client.translate_collection(native_original_xml_noko_obj.to_xml, "application/#{args.format}+xml", "application/vnd.nasa.cmr.umm+json;version=#{args.version}", skip_validation=true )
    umm_response.success? ? puts("\nsuccessful translation to UMM") : abort("\nUMM translation failure:\n#{umm_response.body}")
    umm_json = umm_response.body.to_json

    # translate back to native
    back_to_native = cmr_client.translate_collection(umm_json, "application/vnd.nasa.cmr.umm+json;version=#{args.version}", "application/#{args.format}+xml", skip_validation=true )
    back_to_native.success? ? puts("successful translation to native format \n\n") : abort("Native format translation failure:\n#{back_to_native.body} \n\n")
    native_converted_hash = Hash.from_xml(back_to_native.body)
    native_converted_xml = back_to_native.body


    if args.format.include?('dif') || args.format.include?('iso')
      nokogiri_original = Nokogiri::XML(native_original_xml_noko_obj.to_xml) { |config| config.strict.noblanks } .remove_namespaces!
      nokogiri_converted = Nokogiri::XML(native_converted_xml) { |config| config.strict.noblanks } .remove_namespaces!
    else
      nokogiri_original = Nokogiri::XML(native_original_xml_noko_obj.to_xml) { |config| config.strict.noblanks }
      nokogiri_converted = Nokogiri::XML(native_converted_xml) { |config| config.strict.noblanks }
    end

    arr_paths = Array.new # This array is used to keep track of the paths that lead to arrays that have already been mapped

    nokogiri_original.diff(nokogiri_converted, {:added => true, :removed => true}) do |change,node|
      element = node.to_xml
      path = node.parent.path.split('[')[0]
      arr_path = top_level_arr_path(path, native_original_hash, native_converted_hash)

      if arr_path && path_not_checked?(arr_path, arr_paths)
        arr_paths << arr_path
        array_comparison(arr_path, native_original_hash, native_converted_hash).each { |item| add_to_report(item[0], item[1], item[2], args.disp) }
      elsif path_not_checked?(path, arr_paths)
        if is_xml?(node)
          element = Hash.from_xml(element)
          hash_map(element).each do |item|
            arr_path = top_level_arr_path("#{path}/#{item['path']}", native_original_hash, native_converted_hash)
            if arr_path && path_not_checked?("#{path}/#{item['path']}", arr_paths)
              if path_not_checked?(arr_path, arr_paths)
                arr_paths << arr_path
                array_comparison(arr_path, native_original_hash, native_converted_hash).each { |item| add_to_report(item[0], item[1], item[2], args.disp) }
              end
            elsif path_not_checked?("#{path}/#{item['path']}", arr_paths)
              add_to_report(change, item['value'], "#{path}/#{item['path']}", args.disp)
            end
          end
        elsif (attr,val = is_attribute?(node))
          add_to_report(change, val, "#{path}/#{attr}" , args.disp)
        else
          add_to_report(change, element, path, args.disp)
        end
      end
    end
  end

  def add_to_report(change, element, path, display)
    @counter ||= 0 and @counter += 1
    # this function serves to preclude complex nests from forming in loss_report_output the
    # following 'if' structure is intended to increase readability by eliminating nests
    puts "#{@counter}.".ljust(4)+"#{change}: #{element}".ljust(60) + path + "\n" if display == 'show'
    puts "#{@counter}.".ljust(4)+"#{change}: ".ljust(3) + path + "\n" if display == 'hide'
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

  def array_comparison(path, original_hash, converted_hash)
    pre_translation_array = hash_navigation(path, original_hash)
    post_translation_array = hash_navigation(path, converted_hash)

    pre_translation_array == false ? pre_translation_array = Array.new : pre_translation_array = Array.wrap(pre_translation_array)
    post_translation_array == false ? post_translation_array = Array.new : post_translation_array = Array.wrap(post_translation_array)

    output = Array.new
    (pre_translation_array - post_translation_array).each do |item|
      path_with_index = path + "[#{pre_translation_array.index(item)}]"
      # the following line is used to eliminate indexing confusion when there is more than one occurrence of a particular item in an array
      pre_translation_array[pre_translation_array.index(item)] = item.to_s + ' item indexed'
      output << ['-', item, path_with_index]
    end

    (post_translation_array - pre_translation_array).each do |item|
      path_with_index = path + "[#{post_translation_array.index(item)}]"
      # the following line is used to eliminate indexing confusion when there is more than one occurrence of a particular item in an array
      post_translation_array[post_translation_array.index(item)] = item.to_s + ' item indexed'
      output << ['+', item, path_with_index]
    end
    output
  end
end
