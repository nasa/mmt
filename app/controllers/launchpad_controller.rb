class LaunchpadController < UsersController
  skip_before_action :refresh_launchpad_if_needed

  def keep_alive
    response = refresh_launchpad
    response_status = response[:success] ? :ok : :unauthorized

    render json: response, status: response_status
  end

  def test_launchpad_healthcheck
    # healthcheck is a basic HTML page that returns http 200 and text OK if server is up and accessible
    response = cmr_client.launchpad_healthcheck
    Rails.logger.info "launchpad healthcheck response #{response.clean_inspect}"

    render json: "tested launchpad healthcheck. response: #{response.body}"
  end
end
