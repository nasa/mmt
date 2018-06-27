class MiddlewareHealthcheck
  OK_RESPONSE = [ 200, { 'Content-Type' => 'application/json' }, []]

  def initialize(app)
    @app = app
  end

  def call(env)
    if env['PATH_INFO'.freeze] == '/status'.freeze
      begin
        db_healthy = ActiveRecord::Migrator.current_version != 0
      rescue StandardError => e
        Rails.logger.info "Database error: #{e}"
        db_healthy = false
      end
      conn = Faraday.new('https://apps.launchpad-sbx.nasa.gov/') do |c|
        c.use Faraday::Adapter::NetHttp
      end
      response = conn.get 'healthcheck'
      launchpad_healthy = response.body == 'OK'.freeze
      #launchpad_healthy =  launchpad_healthy.body == 'OK'.freeze
      #get('/healthcheck')
      #request(:get, '/healthcheck', {}, nil, {})
      #launchpad_healthy = send(:get, '/healthcheck').body
      OK_RESPONSE[2] = ["{\"database\":#{db_healthy}, \"launchpad\": #{launchpad_healthy}}"]
      unless ((ENV['launchpad_login_required'] != 'true' || launchpad_healthy) && db_healthy)
        OK_RESPONSE[0] = 503;
      end
      #launchapd = Faraday.new('https://')
      Rails.logger.info "#{OK_RESPONSE}"
      OK_RESPONSE
    else
      @app.call(env)
    end
  end
end
