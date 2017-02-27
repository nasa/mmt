module Cmr
  module Util
    # Times and logs execution of a block
    def self.time(logger, message, &block)
      start = Time.now
      result = yield
    ensure
      if message.is_a?(Proc)
        message.call(Time.now-start, result)
      else
        logger.info("#{message} [#{Time.now - start}s]")
      end
    end

    # Checks a URL for valid formatting and if it is reachable
    def self.url_exists(in_url)
      message = nil
      uri = nil
      url = nil

      begin
        uri = URI.parse(in_url)
      rescue => err
        message = 'Test Endpoint Connection failed: Invalid endpoint.'
        return message
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
          message = 'Test endpoint connection was successful.'
        else
          message = "Test Endpoint Connection failed. Reason: endpoint returned an HTTP status of #{response.env[:response].status}"
        end
      rescue => err
        Rails.logger.error('Invalid endpoint: ' + err.inspect)
        message = 'Test Endpoint Connection failed: Invalid endpoint.'
      end

      message
    end
  end
end
