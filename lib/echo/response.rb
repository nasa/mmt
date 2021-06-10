require 'libxml_to_hash'

module Echo
  # Custom response wrapper for Echo to handle parsing the body appropriately
  class Response
    include Cmr::Util

    def initialize(faraday_response)
      @response = faraday_response
    end

    def headers
      @response.headers
    end

    def status
      @response.status
    end

    def error?
      status >= 400 || (body.is_a?(Hash) && body['errors'])
    end

    def success?
      !error?
    end

    def faraday_response
      @response
    end

    def body
      @response.body
    end

    def parsed_body(parser: 'xml')
      # the libxml_to_hash gem helps us parse much larger xml files (and do it faster)
      # it will create nodes for xml tags that have attributes as well as values
      # which is problematic for the order policies endpoints and for the
      # order options REST endpoints

      body = Hash.send("from_#{parser}", self.body).fetch('Envelope', {}).fetch('Body', {})

      return body.fetch('Fault', {}) if status >= 400

      result = body.fetch(body.keys.first, {}).fetch('result', {})
      result = {} if result.nil?
      result
    end

    def timeout_error?
      status == 504
    end

    def body_is_html?
      error? && headers['content-type'] == 'text/html'
    end

    def error_type
      parsed_body.fetch('detail', {}).keys.first
    end

    def error_message
      return Nokogiri.HTML(body).title if body_is_html?

      doc = Nokogiri.XML(body)
      element = doc.at("faultstring")
      element.nil? ? nil : element.content.gsub(/Token \[(.*?)\]/) { |s| "Token beginning with #{truncate_token($1)}" }
    end

    def clean_inspect
      clean_response = faraday_response.deep_dup
      return clean_response.inspect if body_is_html?

      doc = Nokogiri.XML(clean_response.env[:body])
      doc.traverse do |node|
        node.content = node.content.gsub(/Token \[(.*?)\]/) { |s| "Token beginning with #{truncate_token($1)}" } if node.text?
        node.content = "Token beginning with #{truncate_token(node.content.strip)}" if node.name == 'Token'
      end
      clean_response.env[:body] = doc.to_xml(:save_with => Nokogiri::XML::Node::SaveOptions::AS_XML | Nokogiri::XML::Node::SaveOptions::NO_DECLARATION).strip
      clean_response.inspect
    end

    def error_code
      parsed_body.fetch('detail', {}).fetch(error_type, {}).fetch('ErrorCode', nil)
    end

    def error_id
      parsed_body.fetch('detail', {}).fetch(error_type, {}).fetch('ErrorInstanceId', nil)
    end

  end
end
