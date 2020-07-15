require 'libxml_to_hash'

namespace :collection do
  desc 'Translate a collection from native format to UMM JSON and back to native format'
  task :loss, [:file, :format, :disp, :version] => :environment do |_task, args|
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

    ignored_paths = Array.new

    nokogiri_original.diff(nokogiri_converted, {:added => true, :removed => true}) do |change,node|
      if node.parent.path.include?('[') && !ignored_paths.include?(node.parent.path.split('[')[0])
        ignored_paths << node.parent.path.split('[')[0]
        array_comparison(node.parent.path.split('[')[0], native_original_hash, native_converted_hash).each do |item|
          puts("#{item[0]}: #{item[1]}".ljust(60) + item[2]) if args.disp.eql? 'show'
          puts("#{item[0]}: ". + item[2]) if args.disp.eql? 'hide'
        end
      elsif !ignored_paths.include?(node.parent.path.split('[')[0]) && !path_leads_to_list?(node.parent.path, native_original_hash, native_converted_hash)
        puts("#{change}: #{node.to_xml}".ljust(60) + node.parent.path) if args.disp.eql? 'show'
        puts("#{change}: ". + node.parent.path) if args.disp.eql? 'hide'
      end
    end
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
end
