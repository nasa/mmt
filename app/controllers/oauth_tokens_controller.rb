# :nodoc:
class OauthTokensController < UsersController
  skip_before_action :refresh_launchpad_if_needed, :refresh_urs_if_needed

  def urs_callback
    # URS login
    # store user information after a successful login and return from URS
    if params[:code]
      # Ask CMR for an access token
      response = cmr_client.get_oauth_tokens(params[:code])

      # If the request was successful continue logging in
      if response.success?
        # Adds token response to session variables
        store_oauth_token(response.body)

        # Retreive profile details for the provided token
        profile_response = cmr_client.get_profile(response.body['endpoint'], response.body['access_token'])

        profile = if profile_response.success?
                    profile_response.body
                  else
                    {}
                  end

        # Stores additional information in the session pertaining to the user
        store_profile(profile)

        # Updates the user's available providers
        current_user.set_available_providers(token)

        # Refresh (force retrieve) the list of all providers
        cmr_client.get_providers(true)
      else
        Rails.logger.error("OAuth error: #{response.body}")
      end
    end

    # Redirects the user to an appropriate location
    redirect_after_login
  end
end
