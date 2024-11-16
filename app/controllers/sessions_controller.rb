class SessionsController < ApplicationController
  allow_unauthenticated_access only: %i[ new create ]
  rate_limit to: 10, within: 3.minutes, only: :create, with: -> { redirect_to new_session_url, alert: "Try again later." }

  def new
  end

  def create
    if user = User.authenticate_by(params.require(:session).permit(:email_address, :password))
      start_new_session_for user
      render json: { message: "success", redirect_url: URI(after_authentication_url).path }, status: 200
    else
      render json: { error: "Invalid credentials" }, status: 500
    end
  end

  def destroy
    terminate_session

    render json: { message: "success", redirect_url: URI(login_path).path }, status: 200
  end
end
