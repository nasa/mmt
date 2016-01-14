class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_filter :is_logged_in, :setup_query, :setup_current_user
  before_filter :refresh_urs_if_needed, except: [:logout, :refresh_token]

  protected

  def setup_query
    @query ||= {}
    @provider_ids = cmr_client.get_providers.body.map { |provider| [provider['short-name'], provider['provider-id']] }.sort

    # setup hidden_notifications
    session[:hidden_notifications] ||= []
  end

  def setup_current_user
    @current_user = User.from_urs_uid(session[:urs_uid])
  end

  def redirect_from_urs
    last_point = session[:last_point]
    session[:last_point] = nil
    last_point || root_url
  end

  def cmr_client
    if @cmr_client.nil?
      @cmr_client = Cmr::Client.client_for_environment(cmr_env, Rails.configuration.services)
    end
    @cmr_client
  end

  def cmr_env
    @cmr_env = Rails.configuration.cmr_env
  end
  helper_method :cmr_env

  def edsc_map_path
    service_configs = Rails.configuration.services
    edsc_root = service_configs['earthdata'][cmr_env]['edsc_root']
    "#{edsc_root}/search/map"
  end
  helper_method :edsc_map_path

  def clear_session
    store_oauth_token
    store_profile
  end

  def store_oauth_token(json = {})
    session[:access_token] = json['access_token']
    session[:refresh_token] = json['refresh_token']
    session[:expires_in] = json['expires_in']
    session[:logged_in_at] = json.empty? ? nil : Time.now.to_i
    session[:endpoint] = json['endpoint']
  end

  def store_profile(profile = {})
    uid = session['endpoint'].split('/').last if session['endpoint']
    session[:name] = profile['first_name'].nil? ? uid : "#{profile['first_name']} #{profile['last_name']}"
    session[:urs_uid] = profile['uid'] || uid
    @current_user = User.from_urs_uid(session[:urs_uid])
    return if profile == {}

    # Store ECHO ID
    if @current_user.echo_id.nil?
      echo_user = cmr_client.get_current_user(token).body
      if echo_user['user']
        @current_user.echo_id = echo_user['user']['id']
        @current_user.save
        setup_current_user
      end
    end

    return if @current_user.echo_id.nil?
    return unless @current_user.available_providers.nil?
    @current_user.providers = available_providers(@current_user.echo_id)
  end

  # TODO I really want to move this to user.rb but cmr_client doesn't want to work there
  def available_providers(echo_id)
    providers = []

    # Get groups the user belongs to
    groups = cmr_client.get_groups(echo_id).body
    group_ids = groups.map { |group| group['group']['id'] }

    if group_ids && group_ids.size > 0
      # Get all ACLs
      acls = cmr_client.get_provider_acls.body
      good_acls = acls.select do |acl|
        # If the ACL is an ingest ACL
        acl['acl']['provider_object_identity']['target'] == 'INGEST_MANAGEMENT_ACL' &&

        # if access_control_entries includes at least one of the users group_ids
        # and the UPDATE permission is found
        acl['acl']['access_control_entries'].count { |entry| group_ids.include?(entry['sid']['group_sid']['group_guid']) && entry['permissions'].include?('UPDATE') } > 0
      end

      # Get the provider_guids
      provider_guids = good_acls.map { |acl| acl['acl']['provider_object_identity']['provider_guid'] }

      # Get all providers
      all_providers = cmr_client.get_all_providers.body

      # Find provider_ids for provider_guids and sort
      providers = all_providers.select { |provider| provider_guids.include? provider['provider']['id'] }.map { |provider| provider['provider']['provider_id'] }.sort
    end

    providers
  end

  def refresh_urs_if_needed
    if logged_in? && server_session_expires_in < 0
      refresh_urs_token
    end
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

  def token
    session[:access_token]
  end

  def token_with_client_id
    services = Rails.configuration.services
    config = services['earthdata'][cmr_env]
    client_id = services['urs'][Rails.env.to_s][config['urs_root']]

    "#{token}:#{client_id}"
  end
  helper_method :token_with_client_id

  def logged_in?
    logged_in = session[:access_token].present? &&
                session[:refresh_token].present? &&
                session[:expires_in].present? &&
                session[:logged_in_at]

    store_oauth_token unless logged_in
    logged_in
  end
  helper_method :logged_in?

  def is_logged_in
    redirect_to root_url unless logged_in?
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

  def generate_ingest_errors(errors)
    if errors.size > 0
      ingest_errors = errors.map do |error|
        path = error['path'].nil? ? nil : error['path'].first
        error = error['errors'].nil? ? error : error['errors'].first
        {
          field: path,
          top_field: path,
          page: get_page(path),
          error: error
        }
      end
    else
      ingest_errors = [{
        page: nil,
        field: nil,
        error: 'An unknown error caused publishing to fail.'
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
    EntryTitle
    Abstract
    Purpose
    DataLanguage
  )
  COLLECTION_CITATIONS_FIELDS = %w(
    CollectionCitations
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
  DISTRIBUTION_INFORMATION_FIELDS = %w(
    RelatedUrls
    Distributions
  )
  METADATA_INFORMATION_FIELDS = %w(
    MetadataLanguage
    MetadataDates
  )
  ORGANIZATIONS_FIELDS = %w(
    Organizations
  )
  PERSONNEL_FIELDS = %w(
    Personnel
  )
  SPATIAL_INFORMATION_FIELDS = %w(
    SpatialExtent
    TilingIdentificationSystem
    SpatialInformation
    SpatialKeywords
  )
  TEMPORAL_INFORMATION_FIELDS = %w(
    TemporalExtents
    TemporalKeywords
    PaleoTemporalCoverage
  )

  def get_page(field_name)
    if ACQUISITION_INFORMATION_FIELDS.include? field_name
      'acquisition_information'
    elsif COLLECTION_INFORMATION_FIELDS.include? field_name
      'collection_information'
    elsif COLLECTION_CITATIONS_FIELDS.include? field_name
      'resource_citations'
    elsif DATA_IDENTIFICATION_FIELDS.include? field_name
      'data_identification'
    elsif DESCRIPTIVE_KEYWORDS_FIELDS.include? field_name
      'descriptive_keywords'
    elsif DISTRIBUTION_INFORMATION_FIELDS.include? field_name
      'distribution_information'
    elsif METADATA_INFORMATION_FIELDS.include? field_name
      'metadata_information'
    elsif ORGANIZATIONS_FIELDS.include? field_name
      'organizations'
    elsif PERSONNEL_FIELDS.include? field_name
      'personnel'
    elsif SPATIAL_INFORMATION_FIELDS.include? field_name
      'spatial_information'
    elsif TEMPORAL_INFORMATION_FIELDS.include? field_name
      'temporal_information'
    end
  end
end
