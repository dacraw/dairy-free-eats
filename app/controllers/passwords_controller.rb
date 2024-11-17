class PasswordsController < ApplicationController
  allow_unauthenticated_access
  before_action :set_user_by_token, only: %i[ edit update ]

  def new
  end

  def create
    password_params = params.require(:password).permit(:email_address)
    if user = User.find_by(email_address: password_params[:email_address])
      PasswordsMailer.reset(user).deliver_later
    end

    render json: { message: "Password reset instructions sent (if user with that email address exists)." }, status: 200
  end

  def edit
  end

  def update
    if @user.update(
      password: password_reset_params[:password],
      password_confirmation: password_reset_params[:password_confirmation]
    )
      render json: { message: "success", redirect_url: login_path }
    else
      render json: { message: "failed", error: "Passwords did not match." }, status: 400
    end
  end

  private
    def set_user_by_token
      @user = User.find_by_password_reset_token!(password_reset_params[:token])
    rescue ActiveSupport::MessageVerifier::InvalidSignature
      redirect_to password_reset_path, alert: "Password reset link is invalid or has expired."
    end

    def password_reset_params
      params.permit(:token, :password, :password_confirmation)
    end
end
