class MiddlewareHealthcheck
  def initialize(app)
    @app = app
  end

  def call(env)
    if env['PATH_INFO'.freeze] == '/status'.freeze
      Rails.logger.tagged "middleware database health check" do
        response = [503, {'Content-Type' => 'application/json', 'X-Powered-By' => 'Metadata-Management-Tool', 'X-Version' => Rails.configuration.version}]

        # checks the database health
        begin
          db_healthy = ActiveRecord::Migrator.current_version != 0
        rescue StandardError => e
          Rails.logger.error "Database error: #{e}"
          db_healthy = false
        end
        response[2] = ["{\"database\": #{db_healthy}}"]

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
