module UrlUtil
  # Checks a URL for valid formatting and if it is reachable
  def self.exists?(in_url)
    is_valid = false
    uri = nil
    url = nil

    begin
      uri = URI.parse(in_url)
    rescue => err
      Rails.logger.error('Error parsing endpoint: ' + err.inspect)
      return is_valid
    end

    if uri.scheme.nil?
      url = 'http://' + uri.to_s
    else
      url = uri.to_s
    end

    conn = Faraday.new(:url => url) do |c|
      c.use FaradayMiddleware::FollowRedirects, limit: 3
      c.use Faraday::Response::RaiseError # raise exceptions on 40x, 50x responses
      c.use Faraday::Adapter::NetHttp
    end

    begin
      response = conn.head
      if response.env[:response].status == 200
        is_valid = true
      end
    rescue => err
      Rails.logger.error('Invalid endpoint: ' + err.inspect)
    end
    is_valid
  end
end
