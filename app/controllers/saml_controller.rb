class SamlController < UsersController
  # need to skip this for the endpoint Launchpad sends back authentication to
  skip_before_action :verify_authenticity_token, only: :acs

  # skip login requirements
  skip_before_action :ensure_authenticated
  skip_before_action :setup_query
  skip_before_action :provider_set?

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

    Rails.logger.info "MMT-1286 Launchpad SAML logging. settings set within the sso method: #{settings.inspect}"

    if settings.nil?
      @errors = ['No SP/IDP settings found.']

      Rails.logger.info "Launchpad SAML Settings error. Errors: #{response.errors}"

      render :failure
    end

    request = OneLogin::RubySaml::Authrequest.new

    redirect_to request.create(settings)
  end

  # Assertion Consumer Service
  def acs
    settings = Account.get_saml_settings(get_url_base, get_authn_context)

    @response = OneLogin::RubySaml::Response.new(params[:SAMLResponse], settings: settings)
    # Rails.logger.info "MMT-1286 Launchpad SAML logging. @response after transforming params[:SAMLResponse]: #{@response.inspect}"

    if @response.is_valid?
      # CMR needs our SBXSESSION cookie to be passed to authenticate, which is in the request header from Launchpad

      http_cookie = request.headers['HTTP_COOKIE']
      # Rails.logger.info "MMT-1286 Launchpad SAML logging. request.cookies #{request.cookies}"
      # Rails.logger.info "MMT-1286 Launchpad SAML logging. request.headers['HTTP_COOKIE'] #{http_cookie}"

      # using request.cookies didn't seem to produce a token that could be validated via token service (when copied from Splunk), so using request.headers which does
      sbxsession_cookie = http_cookie.split('; ').select { |cookie| cookie.start_with?('SBXSESSION=') }.first

      sbxsession_cookie.sub!('SBXSESSION=', '')
      session[:sbxsession_cookie] = sbxsession_cookie
      # Rails.logger.info "MMT-1286 Launchpad SAML logging. sbxsession_cookie #{sbxsession_cookie}"

      attributes = @response.attributes
      # Rails.logger.info "MMT-1286 Launchpad SAML logging. attributes: #{attributes.inspect}"
      session[:auid] = attributes[:auid]
      session[:email_launchpad] = attributes[:email]
      session[:launchpad_login_time] = Time.now.to_i
      # Setting a session expiration time to require the user to authenticate with Launchpad again
      # currently 30 min (arbitrarily)
      session[:launchpad_expires_in] = 1800

      # for now, this requires that the user already has their auid and urs_uid associated in URS
      set_urs_profile_from_auid

      redirect_from_urs
    else
      @errors = @response.errors

      Rails.logger.error "Launchpad SAML Response invalid. Errors: #{@response.errors}"

      # Status App runs `raise ForbiddenError.new`, but this is what the NASA github example does
      render :failure
    end
  end

  def metadata
    settings = Account.get_saml_settings(get_url_base)

    meta = OneLogin::RubySaml::Metadata.new

    render xml: meta.generate(settings, true)
  end

  # def logout
  #   reset_session
  # end

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

  def test_keep_alive
    # get request to https://apps.launchpad-sbx.nasa.gov/icam/api/sm/v1/keepalive
    # log request and response
    # render json if request was successful or not
    response = cmr_client.get_keep_alive
    Rails.logger.info "launchpad integration keep alive endpoint response: #{response.inspect}"

    render json: "tested launchpad keep alive. response susccessful? #{response.success?}"
  end

  def test_launchpad_healthcheck
    # get request to https://apps.launchpad-sbx.nasa.gov/healthcheck
    # is a basic HTML page that returns http 200 and text OK if server is up
    response = cmr_client.get_launchpad_healthcheck
    Rails.logger.info "launchpad healthcheck response #{response.inspect}"

    render json: "tested launchpad healthcheck. response: #{response.body}"
  end
end
