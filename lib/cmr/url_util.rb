module UrlUtil
  # Checks a URL for valid formatting and if it is reachable
  def self.exists?(in_url)
    begin
      uri = URI.parse(in_url)
    rescue => err
      Rails.logger.error('Error parsing endpoint: ' + err.inspect)
      return false
    end

    if uri.scheme.nil?
      url = 'http://' + uri.to_s
    else
      url = uri.to_s
    end

    conn = Faraday.new(:url => url) do |c|
      c.use FaradayMiddleware::FollowRedirects, limit: 3
      c.use Faraday::Response::RaiseError # raise exceptions on 40x, 50x responses
      c.adapter Faraday.default_adapter
    end

    begin
      response = conn.head
      unless response.env[:response].status == 200
        return false
      end
    rescue => err
      Rails.logger.error('Invalid endpoint: ' + err.inspect)
      return false
    end
    true
  end
end
