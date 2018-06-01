class LaunchpadController < UsersController
  skip_before_action :refresh_launchpad_if_needed

  def keep_alive
    render json: refresh_launchpad
  end

  def test_launchpad_healthcheck
    # healthcheck is a basic HTML page that returns http 200 and text OK if server is up and accessible
    response = cmr_client.launchpad_healthcheck
    Rails.logger.info "launchpad healthcheck response #{response.inspect}"

    render json: "tested launchpad healthcheck. response: #{response.body}"
  end
end
