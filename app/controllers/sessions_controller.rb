class SessionsController < ApplicationController
  allow_unauthenticated_access only: %i[ new create demo_admin_login ]
  rate_limit to: 10, within: 3.minutes, only: :create, with: -> { redirect_to new_session_url, alert: "Try again later." }

  def new
  end

  def create
    if user = User.authenticate_by(params.require(:session).permit(:email_address, :password))
      start_new_session_for user
      render json: { message: "success", redirect_url: URI(root_url).path }, status: 200
    else
      render json: { error: "Invalid credentials" }, status: 500
    end
  end

  def destroy
    terminate_session

    render json: { message: "success", redirect_url: URI(login_path).path }, status: 200
  end

  def demo_admin_login
    if user = User.authenticate_by(email_address: User::DEMO_ADMIN_EMAIL, password: Rails.application.credentials.dig(:demo_admin_password))
      start_new_session_for user

      render json: { message: "success", redirect_url: admin_dashboard_path }, status: 200
    else
      render json: { error: "Invalid credentials" }, status: 500
    end
  end
end
