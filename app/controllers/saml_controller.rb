class SamlController < UsersController
  # need to skip this for the endpoint Launchpad sends back authentication to
  skip_before_action :verify_authenticity_token, only: :acs

  skip_before_action :refresh_launchpad_if_needed, :refresh_urs_if_needed

  def index
    @attrs = {}
  end

  # Single Sign On
  def sso
    # Unsanitized URL parameters!
    authn_context = (params[:authn_context].nil? ? get_authn_context : params[:authn_context])

    # This needs to go away and be replaced with a parse of the SAML response down in the acs method, because right now it's making a dangerous assumption about the current state of the authenticated user within the application session context.
    case authn_context
    when "urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport"
      session[:auth_level] = 20
    when "urn:oasis:names:tc:SAML:2.0:ac:classes:TimeSyncToken"
      session[:auth_level] = 30
    when "urn:oasis:names:tc:SAML:2.0:ac:classes:SmartcardPKI"
      session[:auth_level] = 40
    else
      session[:auth_level] = 0
    end

    settings = Account.get_saml_settings(get_url_base, authn_context)

    if settings.nil?
      @errors = ['No SP/IDP settings found.']

      Rails.logger.info "Launchpad SAML Settings error. Errors: #{response.errors}"

      redirect_to root_url, flash: { error: "An error has occurred with our login system. Please try again or contact #{view_context.mail_to('support@earthdata.nasa.gov', 'Earthdata Support')}." }
    else
      request = OneLogin::RubySaml::Authrequest.new

      redirect_to request.create(settings)
    end
  end

  # Assertion Consumer Service
  def acs
    settings = Account.get_saml_settings(get_url_base, get_authn_context)

    @response = OneLogin::RubySaml::Response.new(params[:SAMLResponse], settings: settings)

    if @response.is_valid?
      session[:launchpad_cookie] = pull_launchpad_cookie

      attributes = @response.attributes
      session[:auid] = attributes[:auid]
      session[:launchpad_email] = attributes[:email]
      # session expiration time to require the user to authenticate with Launchpad again
      # it should be set to 15 min, the default Launchpad session time
      session[:expires_in] = 900
      session[:logged_in_at] = Time.now.to_i
      session[:original_logged_in_at] = Time.now.to_i

      # for now, this requires that the user already has their auid and urs_uid associated in URS
      # MMT-1432 will allow them to make the association
      urs_profile = get_urs_profile_from_auid

      # Stores additional information in the session pertaining to the user
      store_profile(urs_profile)

      # Updates the user's available providers
      current_user.set_available_providers(token)

      # Refresh (force retrieve) the list of all providers
      cmr_client.get_providers(true)

      redirect_after_login
    else
      @errors = @response.errors

      Rails.logger.error "Launchpad SAML Response invalid. Errors: #{@response.errors}"

      redirect_to root_url, flash: { error: "An error has occurred with our login system. Please try again or contact #{view_context.mail_to('support@earthdata.nasa.gov', 'Earthdata Support')}." }
    end
  end

  def metadata
    settings = Account.get_saml_settings(get_url_base)

    meta = OneLogin::RubySaml::Metadata.new

    render xml: meta.generate(settings, true)
  end

  # def sp_logout_request
  # end
  #
  # def process_logout_response
  # end
  #
  # def idp_logout_request
  # end

  def get_url_base
    ENV['SAML_SP_ISSUER_BASE']
  end

  def get_authn_context
    if session[:auth_level].nil? || session[:auth_level] < 30
      "urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport"
    elsif session[:auth_level].between?(30, 39)
      "urn:oasis:names:tc:SAML:2.0:ac:classes:TimeSyncToken"
    elsif 40 <= session[:auth_level]
      "urn:oasis:names:tc:SAML:2.0:ac:classes:SmartcardPKI"
    end
  end

  private

  def pull_launchpad_cookie
    # CMR needs our Launchpad Cookie to be passed to authenticate, which is in the request header from Launchpad

    http_cookie = request.headers['HTTP_COOKIE']
    # Rails.logger.info "MMT-1286 Launchpad SAML logging. request.cookies #{request.cookies}"
    # Rails.logger.info "MMT-1286 Launchpad SAML logging. request.headers['HTTP_COOKIE'] #{http_cookie}"

    # using request.cookies didn't seem to produce a token that could be validated via token service (when copied from Splunk), so using request.headers which does
    # TODO test using request.cookies now that we can pass the token (in SIT) without trying to copy it from Splunk
    launchpad_cookie = http_cookie.split('; ').select { |cookie| cookie.start_with?("#{launchpad_cookie_name}=") }.first

    launchpad_cookie.sub!("#{launchpad_cookie_name}=", '')
  end
end
