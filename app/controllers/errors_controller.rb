# :nodoc:
class ErrorsController < ApplicationController

  skip_before_action :is_logged_in
  skip_before_action :setup_query
  skip_before_action :refresh_urs_if_needed, except: [:logout, :refresh_token]
  skip_before_action :provider_set?

  def not_found
    render(status: 404)
  end

  def internal_server_error
    render(status: 500)
  end
end
