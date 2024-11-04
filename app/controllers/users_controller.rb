class UsersController < ApplicationController
    def create
        user = User.new user_params

        if user.save
            render json: {message: "user created", user: user.as_json, only: [:id, :email]}, status: 200
        else
            render json: {message: "user was not created", errors: user.errors.full_messages}, status: 400
        end
    end

    private
    def user_params
        params.require(:user).permit(:email, :password, :password_confirmation)
    end
end