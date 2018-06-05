# :nodoc:
class OauthTokensController < UsersController
  skip_before_action :refresh_launchpad_if_needed, :refresh_urs_if_needed

  def urs_association_callback
    # Associating a user's URS urs_uid with their Launchpad auid after a successful
    # login to URS

    # Ask URS for an access token
    oauth_response = cmr_client.get_oauth_tokens(auth_code: params[:code], associate: true)

    # If the request was successful continue logging in
    if oauth_response.success?
      # Retreive URS profile details for the provided token
      profile_response = cmr_client.get_profile(oauth_response.body['endpoint'], oauth_response.body['access_token'])

      profile = if profile_response.success?
                   profile_response.body
                 else
                   {}
                 end

      redirect_to confirm_urs_association_path(profile: profile)
    else
      Rails.logger.error("URS OAuth error in urs_association_callback: #{oauth_response.body}")

      redirect_to root_url, flash: { error: "An error occurred with your Earthdata Login attempt. Please try again or contact #{view_context.mail_to('support@earthdata.nasa.gov', 'Earthdata Support')}" }
    end
  end

  def urs_login_callback
    # URS login
    # store user information after a successful login and return from URS

    # Ask URS for an access token
    oauth_response = cmr_client.get_oauth_tokens(auth_code: params[:code])

    # If the request was successful continue logging in
    if oauth_response.success?
      # Adds token response to session variables
      store_oauth_token(oauth_response.body)

      # Retreive URS profile details for the provided token
      profile_response = cmr_client.get_profile(oauth_response.body['endpoint'], oauth_response.body['access_token'])

      profile = if profile_response.success?
                  profile_response.body
                else
                  {}
                end

      finish_successful_login(profile)
    else
      Rails.logger.error("URS OAuth error in urs_login_callback: #{oauth_response.body}")

      redirect_to root_url, flash: { error: "An error occurred with your Earthdata Login attempt. Please try again or contact #{view_context.mail_to('support@earthdata.nasa.gov', 'Earthdata Support')}" }
    end
  end
end
