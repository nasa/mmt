class JsonCoder
  def self.dump(object, *args)
    JSON.dump(object)
  end

  def self.load(json, *args)
    return {} if json.blank?
    JSON.parse(json)
  rescue JSON::ParserError
    {}
  end
end
