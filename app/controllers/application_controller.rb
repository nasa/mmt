# :nodoc:
class ApplicationController < ActionController::Base
  include Pundit

  # Prevent CSRF attacks by raising an exception.
  protect_from_forgery with: :exception

  before_action :is_logged_in
  before_action :setup_query
  before_action :refresh_urs_if_needed, except: [:logout, :refresh_token]

  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  # By default Pundit calls the current_user method during authorization
  # but for our calls to the CMR ACL we need user information as well as
  # the users valid token. This provides our policies with the ability to
  # retrieve the authenticated user but also to their token
  def pundit_user
    UserContext.new(current_user, token)
  end

  protected

  def groups_enabled?
    redirect_to manage_collections_path unless Rails.configuration.groups_enabled
  end

  def bulk_updates_enabled?
    redirect_to manage_collections_path unless Rails.configuration.bulk_updates_enabled
  end

  def setup_query
    @query ||= {}
    @provider_ids ||= cmr_client.get_providers.body.map { |provider| [provider['short-name'], provider['provider-id']] }.sort
  end

  def redirect_from_urs
    return_to = session[:return_to]
    session[:return_to] = nil

    last_point = session[:last_point]
    session[:last_point] = nil

    redirect_to return_to || last_point || manage_collections_path
  end

  def cmr_client
    @cmr_client ||= Cmr::Client.client_for_environment(Rails.configuration.cmr_env, Rails.configuration.services)
  end
  helper_method :cmr_client

  def echo_client
    @echo_client ||= Echo::Client.client_for_environment(Rails.configuration.echo_env, Rails.configuration.services)
  end
  helper_method :echo_client

  def edsc_map_path
    service_configs = Rails.configuration.services
    edsc_root = service_configs['earthdata'][Rails.configuration.cmr_env]['edsc_root']
    "#{edsc_root}/search/map"
  end
  helper_method :edsc_map_path

  def store_oauth_token(json = {})
    session[:access_token] = json['access_token']
    session[:refresh_token] = json['refresh_token']
    session[:expires_in] = json['expires_in']
    session[:logged_in_at] = json.empty? ? nil : Time.now.to_i
    session[:endpoint] = json['endpoint']
  end

  def authenticated_urs_uid
    session[:urs_uid]
  end

  def current_user
    @current_user ||= User.from_urs_uid(authenticated_urs_uid)
  end
  helper_method :current_user

  def store_profile(profile = {})
    uid = session['endpoint'].split('/').last if session['endpoint']

    session[:name] = profile['first_name'].nil? ? uid : "#{profile['first_name']} #{profile['last_name']}"
    session[:urs_uid] = profile['uid'] || uid
    session[:email_address] = profile['email_address']

    return if profile == {}

    # Store ECHO ID
    if current_user.echo_id.nil?
      echo_user = cmr_client.get_current_user(token).body

      current_user.update(echo_id: echo_user.fetch('user', {}).fetch('id'))
    end

    # With no echo_id we cannot request providers for the user, no sense in continuing
    return if current_user.echo_id.nil?

    # If the user already has available providers, we don't need to fetch them again
    return unless current_user.available_providers.nil?

    # The user has no available providers, but does have an echo_id
    current_user.set_available_providers(token)
  end

  def refresh_urs_if_needed
    refresh_urs_token if logged_in? && server_session_expires_in < 0
  end

  def refresh_urs_token
    json = cmr_client.refresh_token(session[:refresh_token]).body
    store_oauth_token(json)

    if json.nil? && !request.xhr?
      session[:last_point] = request.fullpath

      redirect_to cmr_client.urs_login_path
    end

    json
  end

  def set_provider_context_token
    session[:echo_provider_token] = echo_client.get_provider_context_token(token_with_client_id, behalfOfProvider: current_user.provider_id).parsed_body
  end

  def token
    session[:access_token]
  end
  helper_method :token

  def echo_provider_token
    set_provider_context_token if session[:echo_provider_token].nil?

    session[:echo_provider_token]
  end
  helper_method :echo_provider_token

  def token_with_client_id
    if Rails.env.development? && params[:controller] == 'collections' && params[:action] == 'show'
      # in development, only for download_xml links, we need to use the tokens created on local cmr setup
      'ABC-2'
    else
      services = Rails.configuration.services
      config = services['earthdata'][Rails.configuration.cmr_env]
      client_id = services['urs'][Rails.env.to_s][config['urs_root']]

      "#{token}:#{client_id}"
    end
  end
  helper_method :token_with_client_id

  def logged_in?
    is_user_logged_in = session[:access_token].present? &&
                        session[:refresh_token].present? &&
                        session[:expires_in].present? &&
                        session[:logged_in_at]

    store_oauth_token unless is_user_logged_in
    is_user_logged_in
  end
  helper_method :logged_in?

  def is_logged_in
    session[:return_to] = request.fullpath
    redirect_to login_path unless logged_in?
  end

  def logged_in_at
    session[:logged_in_at].nil? ? 0 : session[:logged_in_at]
  end

  def expires_in
    (logged_in_at + session[:expires_in]) - Time.now.to_i
  end

  # Seconds ahead of the token expiration that the server should
  # attempt to refresh the token
  SERVER_EXPIRATION_OFFSET_S = 60
  # For testing, token expires after 10 seconds
  # SERVER_EXPIRATION_OFFSET_S = 3590

  def server_session_expires_in
    logged_in? ? (expires_in - SERVER_EXPIRATION_OFFSET_S).to_i : 0
  end

  URI_REGEX = %r{^(?:[A-Za-z][A-Za-z0-9+\-.]*:(?:\/\/(?:(?:[A-Za-z0-9\-._~!$&'()*+,;=:]|%[0-9A-Fa-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9A-Fa-f]{1,4}:){6}|::(?:[0-9A-Fa-f]{1,4}:){5}|(?:[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,1}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){3}|(?:(?:[0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){2}|(?:(?:[0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}:|(?:(?:[0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})?::)(?:[0-9A-Fa-f]{1,4}:[0-9A-Fa-f]{1,4}|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))|(?:(?:[0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})?::)|[Vv][0-9A-Fa-f]+\.[A-Za-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(?:[A-Za-z0-9\-._~!$&'()*+,;=]|%[0-9A-Fa-f]{2})*)(?::[0-9]*)?(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*|\/(?:(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)?|(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*|)(?:\?(?:[A-Za-z0-9\-._~!$&'()*+,;=:@\/?]|%[0-9A-Fa-f]{2})*)?(?:\#(?:[A-Za-z0-9\-._~!$&'()*+,;=:@\/?]|%[0-9A-Fa-f]{2})*)?|(?:\/\/(?:(?:[A-Za-z0-9\-._~!$&'()*+,;=:]|%[0-9A-Fa-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9A-Fa-f]{1,4}:){6}|::(?:[0-9A-Fa-f]{1,4}:){5}|(?:[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,1}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){3}|(?:(?:[0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){2}|(?:(?:[0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}:|(?:(?:[0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})?::)(?:[0-9A-Fa-f]{1,4}:[0-9A-Fa-f]{1,4}|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))|(?:(?:[0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})?::)|[Vv][0-9A-Fa-f]+\.[A-Za-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(?:[A-Za-z0-9\-._~!$&'()*+,;=]|%[0-9A-Fa-f]{2})*)(?::[0-9]*)?(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*|\/(?:(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)?|(?:[A-Za-z0-9\-._~!$&'()*+,;=@]|%[0-9A-Fa-f]{2})+(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*|)(?:\?(?:[A-Za-z0-9\-._~!$&'()*+,;=:@\/?]|%[0-9A-Fa-f]{2})*)?(?:\#(?:[A-Za-z0-9\-._~!$&'()*+,;=:@\/?]|%[0-9A-Fa-f]{2})*)?)$}

  DATE_TIME_REGEX = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d{2,3}([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/

  def generate_ingest_errors(response)
    errors = response.body['errors']
    request_id = response.headers['CMR-Request-Id']
    if errors.size > 0
      ingest_errors = errors.map do |error|
        path = error['path'].nil? ? nil : error['path']
        error = error['errors'].nil? ? error : error['errors'].first

        # only show the feedback module link if the error is 500
        request_id = nil unless response.status == 500
        {
          field: path,
          top_field: path,
          page: get_page(path),
          error: error,
          request_id: request_id
        }
      end
    else
      ingest_errors = [{
        page: nil,
        field: nil,
        error: 'An unknown error caused publishing to fail.',
        request_id: request_id
      }]
    end

    ingest_errors
  end

  ACQUISITION_INFORMATION_FIELDS = %w(
    Platforms
    Projects
  )
  COLLECTION_INFORMATION_FIELDS = %w(
    ShortName
    Version
    VersionDescription
    EntryTitle
    Abstract
    Purpose
    DataLanguage
  )
  COLLECTION_CITATIONS_FIELDS = %w(
    CollectionCitations
    DOI
  )
  DATA_IDENTIFICATION_FIELDS = %w(
    DataDates
    CollectionDataType
    ProcessingLevel
    CollectionProgress
    Quality
    UseConstraints
    AccessConstraints
    MetadataAssociations
    PublicationReferences
  )
  DESCRIPTIVE_KEYWORDS_FIELDS = %w(
    ISOTopicCategories
    ScienceKeywords
    AncillaryKeywords
    AdditionalAttributes
  )
  RELATED_URL_FIELDS = %w(
    RelatedUrls
  )
  METADATA_INFORMATION_FIELDS = %w(
    MetadataLanguage
    MetadataDates
  )
  DATA_CENTERS_FIELDS = %w(
    DataCenters
  )
  DATA_CONTACTS_FIELDS = %w(
    DataContacts
  )
  SPATIAL_INFORMATION_FIELDS = %w(
    SpatialExtent
    TilingIdentificationSystem
    SpatialInformation
    LocationKeywords
  )
  TEMPORAL_INFORMATION_FIELDS = %w(
    TemporalExtents
    TemporalKeywords
    PaleoTemporalCoverages
  )

  def get_page(fields)
    # for path in generate_ingest_errors
    return nil if fields.nil?
    # for field in generate_show_errors
    if ACQUISITION_INFORMATION_FIELDS.include? fields.first
      'acquisition_information'
    elsif COLLECTION_INFORMATION_FIELDS.include? fields.first
      'collection_information'
    elsif COLLECTION_CITATIONS_FIELDS.include? fields.first
      'collection_citations'
    elsif DATA_IDENTIFICATION_FIELDS.include? fields.first
      'data_identification'
    elsif DESCRIPTIVE_KEYWORDS_FIELDS.include? fields.first
      'descriptive_keywords'
    elsif RELATED_URL_FIELDS.include? fields.first
      'related_urls'
    elsif METADATA_INFORMATION_FIELDS.include? fields.first
      'metadata_information'
    elsif fields.include?('ContactPersons' || 'ContactGroups') # DATA_CONTACTS
      'data_contacts'
    elsif DATA_CENTERS_FIELDS.include? fields.first
      'data_centers'
    elsif SPATIAL_INFORMATION_FIELDS.include? fields.first
      'spatial_information'
    elsif TEMPORAL_INFORMATION_FIELDS.include? fields.first
      'temporal_information'
    end
  end

  private

  # Custom error messaging for Pundit
  def user_not_authorized(exception)
    policy_name = exception.policy.class.to_s.underscore

    flash[:error] = t("#{policy_name}.#{exception.query}", scope: 'pundit', default: :default)
    redirect_to(request.referrer || manage_cmr_path)
  end

  def get_user_info
    user = {}
    user[:name] = session[:name]
    user[:email] = session[:email_address]
    user
  end
end
