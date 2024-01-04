class MiddlewareHealthcheck
  def initialize(app)
    @app = app
  end

  def call(env)
    if env['PATH_INFO'.freeze] == '/status'.freeze
      Rails.logger.tagged "middleware database health check" do
        response = [503, {'Content-Type' => 'application/json', 'X-Powered-By' => 'Metadata-Management-Tool', 'X-Version' => Rails.configuration.version}]

        queryParams = env['QUERY_STRING']
        check_database = (queryParams == 'checkDatabase')
        check_launchpad = (queryParams == 'checkLaunchpad')
        responseOutput = ""

        # checks the database health when /status?checkDatabase is passed
        if check_database
          begin
            db_healthy = ActiveRecord::Migrator.current_version != 0
          rescue StandardError => e
            Rails.logger.error "Database error: #{e}"
            db_healthy = false
          end
          responseOutput = ["{\"database\": #{db_healthy}}"]
        else
          responseOutput = responseOutput
        end

        # checks the health of launchpad when /status?checkLaunchpad is passed
        if check_launchpad
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
          responseOutput = ["{\"launchpad\": #{launchpad_healthy}}"]
        else 
          responseOutput = responseOutput
        end 

        # checks health of both database and launchpad when /status is passed
        if !check_database && !check_launchpad
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
          responseOutput = ["{\"database\": #{db_healthy}, \"launchpad\": #{launchpad_healthy}}"]
        else
          responseOutput = responseOutput
        end

        response[2] = responseOutput

        if db_healthy
          response[0] = 200
        end
        response
      end
    else
      @app.call(env)
    end
  end
end
