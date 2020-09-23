require 'vcr'

VCR.configure do |c|
  c.cassette_library_dir = Rails.root.join('spec', 'vcr')
  c.hook_into :faraday
  c.allow_http_connections_when_no_cassette = false
  c.ignore_localhost = true
  c.default_cassette_options = { allow_playback_repeats: true }
  c.after_http_request do |request, response|
    Rails.logger.info 'VCR logging: >>>'
    begin
      Rails.logger.debug("Response #{request.method} #{request.uri} result : Headers: #{response.headers} - Body Size (bytes): #{response.body.to_s.bytesize} Status: #{response.status}")
    rescue => e
      Rails.logger.error "#{self.class} Error: #{e}"
    end
    Rails.logger.info '<<<'
  end
end
