# :nodoc:
class ErrorsController < ApplicationController

  skip_before_action :ensure_user_is_logged_in
  skip_before_action :setup_query
  skip_before_action :refresh_urs_if_needed
  skip_before_action :refresh_launchpad_if_needed
  skip_before_action :provider_set?
  skip_before_action :proposal_mode_enabled?

  layout 'error'

  def not_found
    Rails.logger.error "User #{current_user_id} encountered a 404 not found error"

    render(status: 404)
  end

  def internal_server_error
    logger.tagged("#{current_user_id}") do
      Rails.logger.error "User #{current_user_id} encountered an error at Time #{Time.now.to_i} with request method #{request.request_method} to path #{request.original_fullpath}"

      render(status: 500)
    end
  end

  def current_user_id
    current_user ? current_user.urs_uid : '(user not logged in)'
  end
end
