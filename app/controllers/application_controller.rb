class ApplicationController < ActionController::Base
  include Authentication
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern


  def logged_in?
    current_user.present?
  end

  def logout!
    current_user.reset_session_token!
    session[:session_token] = nil
  end
end
