class UsersController < ApplicationController
  include SetProviderHelper
  skip_before_filter :is_logged_in, except: [:set_provider, :refresh_providers]
  skip_before_filter :setup_query

  def login
    session[:last_point] = request.referrer
    session[:last_point] = params[:next_point] if params[:next_point]

    redirect_to cmr_client.urs_login_path
  end

  def logout
    clear_session

    respond_to do |format|
      format.html { redirect_to root_url }
      format.json { render json: nil, status: :ok }
    end
  end

  def set_provider
    provider_id = params[:provider_id] || params[:select_provider]
    current_user.provider_id = provider_id
    current_user.save

    set_provider_context_token

    # Add any controller names we want to exclude here. For anything in this list,
    # the user will be redirected to the Manage Metadata page
    route_exceptions = %w(pages)

    # Get the controller name from the original path
    controller_name = Rails.application.routes.recognize_path(request.referer)[:controller]

    # Return the user to the "index" action of the original controller they were on,
    # unless it's in the exception list.
    if route_exceptions.include?(controller_name)
      session[:return_to] = manage_metadata_path
    else
      session[:return_to] = '/' + controller_name
    end

    respond_to do |format|
      format.html { redirect_to session[:return_to] }
      format.json { render json: nil, status: :ok }
    end
  end

  def refresh_providers
    current_user.update(provider_id: nil)
    current_user.set_available_providers(token)

    redirect_to manage_metadata_path
  end
end
