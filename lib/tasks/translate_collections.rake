require 'libxml_to_hash'

namespace :collection do
  desc 'Translate a collection from native format to UMM JSON and back to native format'
  task :translate, [:file, :format, :disp, :version] => :environment do |_task, args|
    args.with_defaults(:version => '1.15.3')
    args.with_defaults(:disp => 'show')

    puts 'FORMAT INVALID' unless args.format.eql? ('echo10' || 'dif10' || 'iso19115')

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
        puts "-: ". + path_with_index
      end

      conv_arr.each do |item|
        path_with_index = path + "[#{conv_array.index(item)}]"
        puts "+: " + path_with_index #THIS INDEX DOESN'T MAKE SENSE
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
          puts "\n\n\n\n\n\n\n\n USED THIS SECTION \n\n\n\n\n\n\n\n\n\n\n\n"
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

  def cmr_client
    @cmr_client ||= Cmr::Client.client_for_environment(Rails.configuration.cmr_env, Rails.configuration.services)
  end
end
