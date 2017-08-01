# Essentially a Hash object but is used for capturing arbitrary
# JSON for storing and representing UMM JSON Schemas
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
end

# Subclass of JsonObj that accepts a filename instead of JSON. The supplied
# file will be parsed and stored within +parsed_json+ thanks to JsonObj
class JsonFile < JsonObj
  # Path to the file containing the JSON
  attr_accessor :file_path

  # The name of the file to parse
  attr_accessor :file

  def initialize(filename)
    @file_path = File.join(Rails.root, 'lib', 'assets', 'schemas', filename)
    @file = File.read(file_path)

    super(JSON.parse(@file))
  end

  # Override default inspect for a more concise representation of the object
  def inspect
    "#<JsonObj file: \"#{file_path}\">"
  end
end
