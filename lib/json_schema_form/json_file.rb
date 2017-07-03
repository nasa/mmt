# :nodoc:
class JsonObj
  attr_accessor :parsed_json

  def initialize(json)
    @parsed_json = json
  end

  def [](key)
    parsed_json[key]
  end

  def []=(key, value)
    parsed_json[key] = value
  end
end

# :nodoc:
class JsonFile < JsonObj
  attr_accessor :file

  def initialize(filename)
    @file = File.read(File.join(Rails.root, 'lib', 'assets', 'schemas', filename))

    super(JSON.parse(@file))
  end
end
