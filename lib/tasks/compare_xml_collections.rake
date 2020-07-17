require 'libxml_to_hash'

namespace :collection do
  desc 'Translate a collection from native format to UMM JSON and back to native format'
  task :loss, [:file, :format, :disp, :version] => :environment do |_task, args|
    args.with_defaults(:version => '1.15.3')
    args.with_defaults(:disp => 'show')

    abort 'FORMAT INVALID' unless args.format.eql?('echo10') || args.format.eql?('dif10') || args.format.eql?('iso19115')

    filename = args.file.split('/')[-1]
    puts "\nTranslating #{filename} to UMM JSON..."

    native_original_xml = File.read(args.file)
    native_original_hash = Hash.from_xml(native_original_xml)

    #translate to UMM
    umm_response = cmr_client.translate_collection(native_original_xml, "application/#{args.format}+xml", "application/vnd.nasa.cmr.umm+json;version=#{args.version}", skip_validation=true )
    umm_response.success? ? puts("\nsuccessful translation to UMM") : abort("\nUMM translation failure")
    umm_json = umm_response.body.to_json

    # translate back to native
    back_to_native = cmr_client.translate_collection(umm_json, "application/vnd.nasa.cmr.umm+json;version=#{args.version}", "application/#{args.format}+xml", skip_validation=true )
    back_to_native.success? ? puts("successful translation to native format \n\n") : abort("Native format translation failure \n\n")
    native_converted_hash = Hash.from_xml(back_to_native.body)
    native_converted_xml = back_to_native.body

    # nokogiri output
    nokogiri_original = Nokogiri::XML(native_original_xml) { |config| config.strict.noblanks }
    nokogiri_converted = Nokogiri::XML(native_converted_xml) { |config| config.strict.noblanks }

    ignored_paths = Array.new

    nokogiri_original.diff(nokogiri_converted, {:added => true, :removed => true}) do |change,node|
      split_path = node.parent.path.split('[')
      if node.parent.path.include?('[') && !ignored_paths.include?(split_path[0])
        ignored_paths << split_path[0]
        array_comparison(split_path[0], native_original_hash, native_converted_hash).each do |item|
          puts("#{item[0]}: #{item[1]}".ljust(60) + item[2]) if args.disp.eql? 'show'
          puts("#{item[0]}: ". + item[2]) if args.disp.eql? 'hide'
        end
      elsif !ignored_paths.include?(split_path[0]) && !path_leads_to_list?(node.parent.path, native_original_hash, native_converted_hash)
        puts("#{change}: #{node.to_xml}".ljust(60) + node.parent.path) if args.disp.eql? 'show'
        puts("#{change}: ". + node.parent.path) if args.disp.eql? 'hide'
      end
    end
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
    # returns the hash at the end of the path
    path.split('/').each do |key|
      if hash.key?(key) && hash.is_a?(Hash)
        hash = hash[key]
      elsif hash.is_a? Array
        return hash
      end
    end
    hash
  end

  def array_comparison(path, original_hash, converted_hash)

    pretranslation_array = hash_navigation(path, original_hash)
    post_translation_array = hash_navigation(path, converted_hash)

    pretranslation_array.is_a?(Array) ? lost_items_arr = pretranslation_array.clone : lost_items_arr = Array.wrap(pretranslation_array)
    pretranslation_array = Array.wrap(pretranslation_array) unless pretranslation_array.is_a?(Array)
    post_translation_array.is_a?(Array) ? added_itmes_arr = post_translation_array.clone : added_itmes_arr = Array.wrap(post_translation_array)
    post_translation_array = Array.wrap(post_translation_array) unless post_translation_array.is_a?(Array)

    # org_arr and conv_arr are copies of org_array and conv_array, respectively.
    # The *_arr values are edited during the comparison between the org_array and conv_array arrays
    # and so the *_array arrays are used to maintained a full version of each array for indexing the items in the following lines.

    for conv_item in post_translation_array
      for org_item in pretranslation_array
        if org_item.eql? conv_item
          lost_items_arr.delete(org_item)
          added_itmes_arr.delete(conv_item)
          break
        end
      end
    end

    output = Array.new
    lost_items_arr.each do |item|
      path_with_index = path + "[#{pretranslation_array.index(item)}]"
      output << ['-', item, path_with_index]
    end


    added_itmes_arr.each do |item|
      path_with_index = path + "[#{post_translation_array.index(item)}]"
      output << ['+', item, path_with_index]
    end
    output
  end
end
