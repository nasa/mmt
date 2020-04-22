class OgreClient
  # Register custom middleware
  Faraday::Response.register_middleware(logging: Cmr::ClientMiddleware::LoggingMiddleware)

  OGRE_URL = ENV['ogre_url']

  def self.convert_shapefile(options)
    post('/convert', options)
  end

  def self.connection
    Thread.current[:edsc_ogre_connection] ||= build_connection
  end

  private

  def self.post(url, params = {})
    connection.post(url, params)
  end

  def self.build_connection
    Faraday.new(url: OGRE_URL) do |conn|
      conn.use :instrumentation

      conn.request :multipart
      conn.request :url_encoded

      conn.response :logging

      conn.adapter  Faraday.default_adapter
    end
  end
end
