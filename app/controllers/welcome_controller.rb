class WelcomeController < ApplicationController
  def index
    redirect_to dashboard_path if logged_in?
  end
end
