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

    saml_response = OneLogin::RubySaml::Response.new(params[:SAMLResponse], settings: settings, allowed_clock_drift: 2.seconds)

    if saml_response.is_valid?
      # set the login method
      session[:login_method] = 'launchpad'

      session[:launchpad_cookie] = pull_launchpad_cookie

      attributes = saml_response.attributes
      session[:auid] = attributes[:auid]
      session[:launchpad_email] = attributes[:email]
      # session expiration time to require the user to authenticate with Launchpad again
      # it should be set to 15 min, the default Launchpad session time
      session[:expires_in] = 900
      session[:logged_in_at] = Time.now.to_i
      session[:original_logged_in_at] = Time.now.to_i

      Rails.logger.debug "!!!!!!! Returned from Launchpad, in saml#acs and saml_response is valid"
      log_all_session_keys

      # get the user's associated URS profile, if they don't have an associated
      # account, return to allow the redirect to prompt them to link accounts
      urs_profile = get_urs_profile_from_auid || return
      Rails.logger.debug "!!!!!!! Got URS profile"
      log_all_session_keys

      finish_successful_login(urs_profile)
    else
      @errors = saml_response.errors

      Rails.logger.error "Launchpad SAML Response invalid. Errors: #{saml_response.errors}"

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

    # request.cookies and request.headers['HTTP_COOKIE'] both have the launchpad cookie
    # however, when copying from Splunk, the request.cookies version did not work against
    # the token service, and visually looks different from the version in request.headers
    # which works
    http_cookie = request.headers['HTTP_COOKIE']
    launchpad_cookie = http_cookie.split('; ').select { |cookie| cookie.start_with?("#{launchpad_cookie_name}=") }.first

    launchpad_cookie.sub!("#{launchpad_cookie_name}=", '')
  end
end
