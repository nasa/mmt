class LaunchpadController < UsersController
  def test_keep_alive
    # this method currently just checks the keep alive endpoint to make sure it works
    # MMT-1432 will implement the keep alive functionality to keep a launchpad session
    # alive while the user is active
    response = cmr_client.get_keep_alive(token)
    Rails.logger.info "launchpad integration keep alive endpoint response: #{response.inspect}"

    session[:launchpad_cookie] = response.headers.fetch('set-cookie', '').split("#{launchpad_cookie_name}=").last

    render json: "tested launchpad keep alive. response susccessful? #{response.success?}"
  end

  def test_launchpad_healthcheck
    # healthcheck is a basic HTML page that returns http 200 and text OK if server is up and accessible
    response = cmr_client.get_launchpad_healthcheck
    Rails.logger.info "launchpad healthcheck response #{response.inspect}"

    render json: "tested launchpad healthcheck. response: #{response.body}"
  end
end
