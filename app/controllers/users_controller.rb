# :nodoc:

class UsersController < ApplicationController
  include ProviderContextRedirector

  skip_before_action :ensure_user_is_logged_in, except: [:set_provider, :refresh_providers]
  skip_before_action :setup_query
  skip_before_action :provider_set?
  skip_before_action :proposal_mode_enabled?
  skip_before_action :proposal_approver_permissions


  def login
    session[:last_point] = request.referrer
    session[:last_point] = params[:next_point] if params[:next_point]

    ensure_at_least_one_login_method || return

    if both_login_methods_on?
      if params[:login_method] == 'launchpad'
        redirect_to sso_url
      elsif params[:login_method] == 'urs'
        redirect_to cmr_client.urs_login_path, allow_other_host: true
      else
        redirect_to root_url
      end
    elsif launchpad_login_required?
      redirect_to sso_url
    elsif urs_login_required?
      redirect_to cmr_client.urs_login_path, allow_other_host: true
    end
  end

  def logout
    reset_session

    respond_to do |format|
      format.html { redirect_to root_url }
      format.json { render json: nil, status: :ok }
    end
  end

  def provider_context; end

  def set_provider
    # Clear the currently set provider context token incase the call to create
    # the new one fails -- we don't want to leave the value set.
    session.delete(:echo_provider_token)

    provider_id = params[:provider_id] || params[:select_provider]

    current_user.update(provider_id: provider_id)

    respond_to do |format|
      format.html { redirect_to get_redirect_route(request.referer) }
      format.json { render json: nil, status: :ok }
    end
  end

  def refresh_providers
    # Update the user's available providers
    current_user.set_available_providers(token)

    cached_providers = get_cached_providers
    all_providers = get_all_providers

    # check if there has been a change in providers
    refresh_all_providers = all_providers != cached_providers

    all_providers = all_providers.map { |provider| [provider['short-name'], provider['provider-id']] }.sort

    respond_to do |format|
      format.html do
        if current_user.provider_id.nil?
          redirect_to provider_context_path
        else
          redirect_to root_path
        end
      end
      format.json do
        if current_user.provider_id.nil?
          # If the current provider was lost, redirect to the provider_context page
          render json: { redirect: provider_context_path.to_s }
        else
          render json: { available_providers:   current_user.available_providers,
                         provider_id:           current_user.provider_id,
                         refresh_all_providers: refresh_all_providers,
                         all_providers:         all_providers }
        end
      end
    end
  end

  def prompt_urs_association; end

  def confirm_urs_association
    @profile = params[:profile]
    @auid = session[:auid]
  end

  def associate_urs_and_launchpad_ids
    profile = params[:profile]
    auid = session[:auid]

    association_response = cmr_client.associate_urs_uid_and_auid(profile[:uid], auid)
    if association_response.success?
      flash[:success] = I18n.t('controllers.users.associate_urs_and_launchpad_ids.flash.success')

      finish_successful_login(profile)
    else
      Rails.logger.error "Error trying to associate a user's URS urs_uid (#{profile[:uid]}) and Launchpad auid (#{auid}): #{association_response.clean_inspect}"

      redirect_to root_url, flash: { error: "#{association_response.error_message(i18n: I18n.t('controllers.users.associate_urs_and_launchpad_ids.flash.error'))}.\nPlease try again or contact #{view_context.mail_to('support@earthdata.nasa.gov', 'Earthdata Support')}" }
    end
  end

  private

  def finish_successful_login(profile)
    # there is additional logging for Launchpad and URS
    # once Launchpad has been live and stable in production for a while
    # the Launchpad logging (`log_all_session_keys`) can be removed with MMT-1615
    # once the URS refresh token issue has been diagnosed or resolved,
    # the URS logging (`log_urs_session_keys`) can be removed with MMT-1616
    Rails.logger.debug '>>>>> running store_profile'
    # Stores additional information in the session pertaining to the user
    store_profile(profile)
    Rails.logger.info "Successful URS Login by user #{authenticated_urs_uid}" if session[:login_method] == 'urs'
    log_urs_session_keys
    log_all_session_keys

    unless Rails.configuration.proposal_mode
      # users do not need providers in proposal mode (Draft MMT)

      Rails.logger.debug '>>>>> running set_available_providers'
      # Updates the user's available providers
      current_user.set_available_providers(token)
      log_all_session_keys

      Rails.logger.debug '>>>>> running get_providers'
      # Refresh (force retrieve) the list of all providers
      cmr_client.get_providers(true)
      log_all_session_keys
    end

    # Redirects the user to an appropriate location
    redirect_after_login
  end

  def get_cached_providers
    # retrieve the cached list of all providers
    response = cmr_client.get_providers
    if response.success?
      response.body
    else
      []
    end
  end

  def get_all_providers
    # Refresh (force retrieve) the list of all providers
    response = cmr_client.get_providers(true)
    if response.success?
      response.body
    else
      []
    end
  end

  def get_urs_profile_from_auid
    urs_profile_response = cmr_client.get_urs_uid_from_nams_auid(session[:auid])
    if urs_profile_response.success?
      urs_profile_response.body
    else
      Rails.logger.info "User with auid #{session[:auid]} does not have an associated URS account. Prompting user to associate accounts. Response: #{urs_profile_response.clean_inspect}"

      redirect_to prompt_urs_association_path and return
    end
  end
end
