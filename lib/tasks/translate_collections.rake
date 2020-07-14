require 'libxml_to_hash'

namespace :collection do
  desc 'Translate a collection from native format to UMM JSON and back to native format'
  task :translate, [:file, :format, :disp, :version] => :environment do |_task, args|
    args.with_defaults(:version => '1.15.3')
    args.with_defaults(:disp => 'show')

    abort 'FORMAT INVALID' unless args.format.eql? ('echo10' || 'dif10' || 'iso19115')

    filename = args.file.split('/')[-1]
    puts "\nTranslating #{filename} to UMM JSON..."

    native_original_xml = File.read(args.file)
    native_original_hash = Hash.from_xml(native_original_xml)

    #translate to UMM
    umm_response = cmr_client.translate_collection(native_original_xml, "application/#{args.format}+xml", "application/vnd.nasa.cmr.umm+json;version=#{args.version}", skip_validation=true )
    umm_json = umm_response.body.to_json
    umm_response.success? ? puts("\nsuccessful translation to UMM") : abort("\nUMM translation failure")

    # translate back to native
    back_to_native = cmr_client.translate_collection(umm_json, "application/vnd.nasa.cmr.umm+json;version=#{args.version}", "application/#{args.format}+xml", skip_validation=true )
    native_converted_hash = Hash.from_xml(back_to_native.body)
    native_converted_xml = back_to_native.body
    back_to_native.success? ? puts("successful translation to native format \n\n") : abort("Native format translation failure \n\n")

    # nokogiri output
    nokogiri_original = Nokogiri::XML(native_original_xml) { |config| config.strict.noblanks }
    nokogiri_converted = Nokogiri::XML(native_converted_xml) { |config| config.strict.noblanks }

    nokogiri_original.diff(nokogiri_converted, {:added => true, :removed => true}) do |change,node|
      next if path_leads_to_list?(node.parent.path, native_original_hash, native_converted_hash)
        puts("#{change}: #{node.to_xml}".ljust(60) + node.parent.path) if args.disp.eql? 'show'
        puts("#{change}: ". + node.parent.path) if args.disp.eql? 'hide'
    end

    # find differences
    dif_hash = find_difference_bt_hashes(native_original_hash, native_converted_hash)
    compare_arrays(dif_hash, native_original_hash, native_converted_hash)

  end

  def path_leads_to_list?(path, org_hash, conv_hash)
    # this method takes a path string (and the full original and converted hashes) and outputs true if the path string contains a list; else false
    org_hash_path = hash_navigation(path, org_hash)
    conv_hash_path = hash_navigation(path, conv_hash)

    return false if org_hash_path == false || conv_hash_path == false

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
    # Passed a path string and the hash being navigated. This method parses the path string and
    # returns the hash at the end of the path
    dir = dir.split("/")
    if dir.is_a? Array
      dir.each do |key|
        if !key.empty? && hash.is_a?(Hash)
          hash = hash[key]
        elsif hash.is_a? Array
          return false
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

  def compare_arrays(dif_hash, original, converted)
    # arguments: differences hash, the original hash, and converted hash
    # each path that leads to an array is used to navigate to that array and
    # subsequently compare the arrays in the original and converted hashes.
    # there is no usable ouput; there is printing to the terminal
    paths = get_list_paths(dif_hash, original, converted)

    paths.each do |path|
      org_array = hash_navigation(path, original)
      conv_array = hash_navigation(path, converted)

      org_array.is_a?(Array) ? org_arr = Array.wrap(org_array) : org_arr = org_array.clone
      org_array = Array.wrap(org_array) unless org_array.is_a?(Array)
      conv_array.is_a?(Array) ? conv_arr = Array.wrap(conv_array) : conv_arr = conv_array.clone
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
        puts "-: ". + path_with_index
      end

      conv_arr.each do |item|
        path_with_index = path + "[#{conv_array.index(item)}]"
        puts "+: " + path_with_index
      end
    end
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

  def cmr_client
    @cmr_client ||= Cmr::Client.client_for_environment(Rails.configuration.cmr_env, Rails.configuration.services)
  end
end
