class UsersController < ApplicationController

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
end
