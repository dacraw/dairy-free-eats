class Api::V1::SessionsController < ApplicationController
    def new
    end

    def create
        user = User.find_by_email(session_params[:email])

        return render json: { message: "Invalid credentials." }, status: 400 if user.nil?

        # set the password in order to login and pass validation when resetting session token
        # user.password = session_params[:password]

        authenticated_user = user.authenticate(session_params[:password])

        # debugger
        p "dougie: #{authenticated_user}"
        return render json: { message: "Invalid credentials." }, status: 400 if !authenticated_user

        login(user)

        render json: { message: "Login Successful" }, status: 200
    end

    def destroy
        logout! if current_user

        render json: { message: "successfully logged out" }, status: 200
    end

    def check_current_user
        render json: { current_user: current_user.as_json(only: [ :id ]) }
    end

    private
    def session_params
        params.require(:session).permit(:email, :password)
    end
end
