class SamlController < UsersController
  # skip urs login requirements application controller
  skip_before_action :is_logged_in
  skip_before_action :setup_query
  skip_before_action :refresh_urs_if_needed, except: [:logout, :refresh_token]
  skip_before_action :provider_set?

  # skip_before_action :require_launchpad_authorization

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

      logger.info "Settings error. Errors: #{response.errors}"

      render action: :failure
    end

    request = OneLogin::RubySaml::Authrequest.new

    redirect_to request.create(settings)
  end

  # Assertion Consumer Service
  def acs
    settings = Account.get_saml_settings(get_url_base, get_authn_context)

    @response = OneLogin::RubySaml::Response.new(params[:SAMLResponse], settings: settings)

    if @response.is_valid?
      # TODO params[:SAMLResponse] _should be_ what CMR wants us to pass as a token
      # However, currently this is causing a ActionDispatch::Cookies::CookieOverflow
      # problem. We may want to use https://github.com/rails/activerecord-session_store
      # to store and pass it
      # TODO since the SAML library is able to decrypt SAMLResponse to data we can use,
      # can it also re-encrypt it?
      # session[:launchpad_response_string] = params[:SAMLResponse]

      attributes = @response.attributes
      session[:auid] = attributes[:auid]
      # session[:email] = attributes[:email]
      # TODO need to verify and set what other session info is needed

      redirect_after_login
    else
      @errors = @response.errors

      Rails.logger.error "Response invalid. Errors: #{@response.errors}"

      # Status App runs `raise ForbiddenError.new`, but this is what the NASA github example does
      render :failure
    end
  end

  def metadata
    settings = Account.get_saml_settings(get_url_base)

    meta = OneLogin::RubySaml::Metadata.new

    render xml: meta.generate(settings, true)
  end

  def logout
    reset_session
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
    Figaro.env.SAML_SP_ISSUER_BASE
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
end
