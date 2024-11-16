class SessionsController < ApplicationController
  allow_unauthenticated_access only: %i[ new create ]
  rate_limit to: 10, within: 3.minutes, only: :create, with: -> { redirect_to new_session_url, alert: "Try again later." }

  def new
  end

  def create
    if user = User.authenticate_by(params.require(:session).permit(:email_address, :password))
      start_new_session_for user

      # This is redirect to the /signup path when starting the app on any page but /login
      # e.g., visit home page, refresh, then login, it will redirect to /signup after logging in
      # I believe this has to do with :require_authentication while logging out,
      # But I have no idea why the /signup route is the request.url , since I don't see it being explicitly set anywhere in the code
      # For now, redirect to the index page after successful sign in
      # render json: { message: "success", redirect_url: URI(after_authentication_url).path }, status: 200
      render json: { message: "success", redirect_url: URI(root_url).path }, status: 200
    else
      render json: { error: "Invalid credentials" }, status: 500
    end
  end

  def destroy
    terminate_session

    render json: { message: "success", redirect_url: URI(login_path).path }, status: 200
  end
end
