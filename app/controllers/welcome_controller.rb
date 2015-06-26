class WelcomeController < ApplicationController
  skip_before_filter :is_logged_in

  def index
    redirect_to dashboard_path if logged_in?
  end
end
