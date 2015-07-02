class OauthTokensController < ApplicationController
  skip_before_filter :is_logged_in, :setup_query

  def urs_callback
    if params[:code]
      auth_code = params[:code]
      response = cmr_client.get_oauth_tokens(auth_code)

      if response.success?
        store_oauth_token(response.body)
        profile = cmr_client.get_profile(response.body['endpoint'], response.body['access_token'])
        store_profile(profile.body)
        # useful for debugging
        # Rails.logger.info "Profile: #{profile.body}"
      else
        Rails.logger.error("Oauth error: #{response.body}")
      end
      # useful when needing to replace the application.yml tokens
      # Rails.logger.info "Token: #{response.body.inspect}"
    end

    redirect_to redirect_from_urs
  end

  # MMT-125
  # def refresh_token
  #   json = refresh_urs_token
  #
  #   # if json
  #   #   render json: {tokenExpiresIn: script_session_expires_in}
  #   # else
  #   #   render json: nil, status: 401
  #   # end
  # end
end
