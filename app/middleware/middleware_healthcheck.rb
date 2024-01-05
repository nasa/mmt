class MiddlewareHealthcheck
  def initialize(app)
    @app = app
  end

  def call(env)
    if env['PATH_INFO'.freeze] == '/status'.freeze
      Rails.logger.tagged "middleware database health check" do
        response = [503, {'Content-Type' => 'application/json', 'X-Powered-By' => 'Metadata-Management-Tool', 'X-Version' => Rails.configuration.version}]

        query_params = env['QUERY_STRING']
        check_database = (query_params == 'checkDatabase')
        check_launchpad = (query_params == 'checkLaunchpad')
        db_healthy = false
        launchpad_healthy = false
        response_output = ""

        # checks the database health when /status?checkDatabase is passed
        if check_database
          response_output = process_database_check
        end

        # checks the health of launchpad when /status?checkLaunchpad is passed
        if check_launchpad
          response_output = process_launchpad_check
        end

        # checks health of both database and launchpad when /status is passed
        if !check_database && !check_launchpad
          response_output = process_status_check
        end

        response[2] = response_output

        # If launchpad is disabled then we will not report a 503 error if launchpad still fails
        if db_healthy && (ENV['launchpad_login_required'] != 'true' || launchpad_healthy)
          response[0] = 200
        end
        response
      end
    else
      @app.call(env)
    end
  end

  private 

  def process_database_check
    begin
      db_healthy = ActiveRecord::Migrator.current_version != 0
    rescue StandardError => e
      Rails.logger.error "Database error: #{e}"
      db_healthy = false
    end
    response_output = ["{\"database\": #{db_healthy}}"]
  end

  def process_launchpad_check
    cmr_client = Cmr::Client.client_for_environment(Rails.configuration.cmr_env, Rails.configuration.services)
    cmr_client.timeout = 10
    begin
      launchpad_healthy = cmr_client.launchpad_healthcheck.body == 'OK'.freeze
    rescue Faraday::TimeoutError
      Rails.logger.error "Faraday timeout healthcheck error: #{e}"
      launchpad_healthy = false
    rescue Faraday::ConnectionFailed
      Rails.logger.error "Faraday connection failed healthcheck error: #{e}"
      launchpad_healthy = false
    rescue StandardError => e
      Rails.logger.error "Other healthcheck error: #{e.class} #{e}"
      launchpad_healthy = false
    end
    response_output = ["{\"launchpad\": #{launchpad_healthy}}"]
  end

  def process_status_check
    begin
      db_healthy = ActiveRecord::Migrator.current_version != 0
    rescue StandardError => e
      Rails.logger.error "Database error: #{e}"
      db_healthy = false
    end

    cmr_client = Cmr::Client.client_for_environment(Rails.configuration.cmr_env, Rails.configuration.services)
    cmr_client.timeout = 10
    begin
      launchpad_healthy = cmr_client.launchpad_healthcheck.body == 'OK'.freeze
    rescue Faraday::TimeoutError
      Rails.logger.error "Faraday timeout healthcheck error: #{e}"
      launchpad_healthy = false
    rescue Faraday::ConnectionFailed
      Rails.logger.error "Faraday connection failed healthcheck error: #{e}"
      launchpad_healthy = false
    rescue StandardError => e
      Rails.logger.error "Other healthcheck error: #{e.class} #{e}"
      launchpad_healthy = false
    end
    response_output = ["{\"database\": #{db_healthy}, \"launchpad\": #{launchpad_healthy}}"]
  end
end
