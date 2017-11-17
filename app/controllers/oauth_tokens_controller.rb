class OauthTokensController < ApplicationController
  skip_before_filter :is_logged_in
  skip_before_filter :setup_query

  def urs_callback
    if params[:code]
      # Ask CMR for an access token
      response = cmr_client.get_oauth_tokens(params[:code])

      # If the request was successful continue logging in
      if response.success?
        # Adds token response to session variables
        store_oauth_token(response.body)

        # Retreive profile details for the provided token
        profile = cmr_client.get_profile(response.body['endpoint'], response.body['access_token'])

        # Stores additional information in the session pertaining to the user
        store_profile(profile.body)

        # Updates the user's available providers
        current_user.set_available_providers(token)
      else
        Rails.logger.error("OAuth error: #{response.body}")
      end
    end

    # Redirects the user to an appropriate location
    redirect_from_urs
  end
end
