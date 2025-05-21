module JsonSchemaForm
  class JsonObj
    # The JSON string this class represents
    attr_accessor :parsed_json

    def initialize(json)
      @parsed_json = json
    end

    # Getter for accessing the JSON stored within +parsed_json+
    #
    # ==== Attributes
    #
    # * +key+ - The key to retrieve from +parsed_json+
    def [](key)
      parsed_json[key]
    end

    # Setter for setting values within +parsed_json+
    #
    # ==== Attributes
    #
    # * +key+ - The key to set within +parsed_json+
    # * +value+ - The value to associate with the provided key within  +parsed_json+
    def []=(key, value)
      parsed_json[key] = value
    end

    # Override default inspect for a more concise representation of the object
    def inspect
      '#<JsonObj>'
    end

    # UMM-S 1.1 introducted RelatedURLs as a top level field, this method is
    # used to create the correct underscored version of that name
    def underscore_fix_for_related_urls(key)
      if key == 'RelatedURLs'
        'related_urls'
      else
        key.underscore
      end
    end
  end
end
