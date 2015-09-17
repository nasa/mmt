VCR.configure do |c|
  c.cassette_library_dir = Rails.root.join('spec', 'vcr')
  c.hook_into :faraday
  c.allow_http_connections_when_no_cassette = false
  c.ignore_hosts '127.0.0.1', 'localhost'
  c.default_cassette_options = { allow_playback_repeats: true }
end
