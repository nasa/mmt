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

      # checks the health of launchpad
      cmr_client = Cmr::Client.client_for_environment(Rails.configuration.cmr_env, Rails.configuration.services)
      response = cmr_client.launchpad_healthcheck
      launchpad_healthy = response.body == 'OK'.freeze
      OK_RESPONSE[2] = ["{\"database\": #{db_healthy}, \"launchpad\": #{launchpad_healthy}}"]

      # If launchpad is disabled then we will not report a 500 error if launchpad still fails
      unless ((ENV['launchpad_login_required'] != 'true' || launchpad_healthy) && db_healthy)
        OK_RESPONSE[0] = 503;
      end
      OK_RESPONSE
    else
      @app.call(env)
    end
  end
end
