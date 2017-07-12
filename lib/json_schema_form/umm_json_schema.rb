# Class that represents a UMM JSON Schema
class UmmJsonSchema < JsonFile
  def initialize(schema_filename)
    super(schema_filename)
  end

  # Recursively replace all '$ref' keys in the schema file with their actual values
  #
  # ==== Attributes
  #
  # * +fragment+ - The JSON to recursively replace references for
  def fetch_references(fragment)
    # Loop through each key in the current hash element
    fragment.each do |_key, element|
      # Skip this element if it's not a hash, no $ref will exist
      next unless element.is_a?(Hash)

      # If we have a reference to follow
      if element.key?('$ref')
        file, path = element['$ref'].split('#')

        # Fetch the reference from the file that it's defined to be in
        referenced_property = if file.blank?
                                # This is an internal reference (lives within the file we're parsing)
                                parsed_json['definitions'][path.split('/').last]
                              else
                                # Fetch the reference from an external file
                                referenced_file = UmmJsonSchema.new(file)
                                referenced_file.fetch_references(referenced_file.parsed_json)
                                referenced_schema = referenced_file.parsed_json
                                referenced_schema['definitions'][path.split('/').last]
                              end

        # Merge the retrieved reference into the schema
        element.merge!(referenced_property)

        # Remove the $ref key so we don't attempt to parse it again
        element.delete('$ref')
      end

      # Keep diggin'
      fetch_references(element)
    end
  end

  # Receives a key from the form JSON and returns the relevant fragment of the schema with
  # the provided key inserted in the fragment of the schema. This
  #
  # ==== Attributes
  #
  # * +key+ - The key to search for within +parsed_json+
  def retrieve_schema_fragment(key)
    # Retreive the requested key from the schema
    property = key.split('/').reduce(parsed_json['properties']) { |a, e| a.fetch(e, {}) }

    # Set the 'key' attribute within the property has so that we have reference to it
    property['key'] = key

    property
  rescue
    {}
  end

  # We use a separator in our key names for the purposes of looking them up
  # in the schema when nested. However, we often need just the actual key, which is
  # what this method does for us.
  #
  # ==== Attributes
  #
  # * +key+ - The full key to retrieve just the leaf portion of
  # * +separator+ - The character(s) that separate nested keys
  def fetch_key_leaf(key, separator: '/')
    key.split(separator).last
  end

  # Retruns the required fields from the schema
  def required_fields
    parsed_json.fetch('required', [])
  end

  # Determine whether or not the provided key is required
  #
  # ==== Attributes
  #
  # * +key+ - The key in which you'd like to check for requirement
  def required_field?(key)
    required_fields.include?(fetch_key_leaf(key))
  end

  def sanitize_form_input(object)
    puts "before object: #{object}"
    object['draft'] = object['draft'].to_hash.to_camel_keys
    object = convert_to_arrays(object)
    object = compact_blank(object)

    # TODO convert type specific fields (boolean/number)

    puts "after object: #{object}"
    object
  end

  def convert_to_arrays(object)
    case object
    when Hash
      keys = object.keys
      if keys.first =~ /\d+/
        object = object.map { |_key, value| value }
        object.each do |value|
          convert_to_arrays(value)
        end
      else
        object.each do |key, value|
          object[key] = convert_to_arrays(value)
        end
      end
    when Array
      object.each do |value|
        convert_to_arrays(value)
      end
    end
    object
  end

  def compact_blank(node)
    return node.map { |n| compact_blank(n) }.compact.presence if node.is_a?(Array)
    return node if node == false
    return node.presence unless node.is_a?(Hash)
    result = {}
    node.each do |k, v|
      result[k] = compact_blank(v)
    end
    result = result.compact
    result.compact.presence
  end
end
