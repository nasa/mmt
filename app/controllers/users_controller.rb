# :nodoc:
class UsersController < ApplicationController
  include ProviderContextRedirector

  skip_before_filter :is_logged_in, except: [:set_provider, :refresh_providers]
  skip_before_filter :setup_query
  skip_before_filter :provider_set?

  def login
    session[:last_point] = request.referrer
    session[:last_point] = params[:next_point] if params[:next_point]

    redirect_to cmr_client.urs_login_path
  end

  def logout
    reset_session

    respond_to do |format|
      format.html { redirect_to root_url }
      format.json { render json: nil, status: :ok }
    end
  end

  def provider_context
  end

  def set_provider
    # Clear the currently set provider context token incase the call to create
    # the new one fails -- we don't want to leave the value set.
    session.delete(:echo_provider_token)

    provider_id = params[:provider_id] || params[:select_provider]

    current_user.update(provider_id: provider_id)

    set_provider_context_token

    respond_to do |format|
      format.html { redirect_to get_redirect_route(request.referer) }
      format.json { render json: nil, status: :ok }
    end
  end

  def refresh_providers
    # Update the user's available providers
    current_user.set_available_providers(token)

    all_providers = get_all_providers
    # check if there has been a change in providers
    refresh_all_providers = all_providers != get_cached_providers

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

  private

  def get_cached_providers
    # retrieve the cached list of all providers
    response = cmr_client.get_providers
    response.body if response.success?
  end

  def get_all_providers
    # Refresh (force retrieve) the list of all providers
    response = cmr_client.get_providers(true)
    response.body if response.success?
  end
end
