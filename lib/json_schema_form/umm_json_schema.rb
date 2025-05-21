module JsonSchemaForm
  # Class that represents a UMM JSON Schema
  class UmmJsonSchema < JsonFile
    def initialize(schema_type, schema_filename)
      super(schema_type, schema_filename)
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

    # Returns the required fields from the schema
    def required_fields(key)
      path = key.split('/')
      if path.size == 1
        # top level required fields
        parsed_json.fetch('required', [])
      else
        # required fields from definitions
        key_parts = path - %w(index_id)

        json = key_parts.take(key_parts.size - 2).reduce(parsed_json['properties']) { |a, e| a.fetch(e, {}) }

        json.fetch('required', [])
      end
    end

    # Determine whether or not the provided key is required
    # If the terminal 'items' is not removed, fetch_key_leaf will return it and
    # it will not correctly identify some required fields.
    # The current use case for this is IndexRanges in UMM-V 1.7, which should have
    # conditionally required fields.
    #
    # ==== Attributes
    #
    # * +key+ - The key in which you'd like to check for requirement
    def required_field?(key)
      validation_key = key.sub(/(.*)\/items/, '\1') if key.ends_with?('items')
      validation_key ||= key
      required_fields(validation_key).include?(fetch_key_leaf(validation_key))
    end

    # Retrieve the full keys for all elements within the provided fragement that
    # match the provided type
    #
    # ==== Attributes
    #
    # * +fragment+ - The JSON (schema) fragment to retrieve elements within
    # * +type+ - The type of objects to retrieve keys for
    def fragment_elements_by_type(fragment, type)
      elements_by_type({}, fragment).fetch(type, [])
    end

    # Retrieve the type of the provided key
    #
    # ==== Attributes
    #
    # * +key+ - The full key to the element to get the type of
    # * +ignore_keys+ - Keys to ignore when returning the elements
    def element_type(key, ignore_keys: %w(items properties index_id))
      # Because we could be asking about a key within an array, we strip integers from our key before looking it up
      sanitized_key = key.split('/').reject { |l| l =~ /\A\d+\z/ }.join('/')

      elements_by_type({}, parsed_json['properties']).each do |type, keys|
        return type if keys.map { |type_key| (type_key.split('/') - ignore_keys).reject(&:blank?).join('/') }.include?(sanitized_key)
      end
      nil
    end

    # Construct and return a hash with keys representing the type of object specified in the schema
    #
    # ==== Attributes
    #
    # * +result+ - The hash that the result will end up in
    # * +fragment+ - The JSON (schema) fragment to retrieve types for
    # * +key+ - The key of the current JSON (schema) fragment
    def elements_by_type(result, fragment, key = nil)
      fragment.each do |fragment_key, element|
        # Skip this element if it's not a hash
        next unless element.is_a?(Hash)

        new_key = [key, fragment_key].reject(&:blank?).join('/')

        # If we have a reference to follow
        unless element['type'].nil? || %w(object array).include?(element['type'])
          result[element['type']] = [] unless result.key?(element['type'])
          result[element['type']] << new_key
        end

        # Keep diggin'
        elements_by_type(result, element, new_key)
      end

      result
    end
  end
end
