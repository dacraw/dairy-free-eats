class SessionsController < ApplicationController
    def new
    end

    def create
        user = User.find_by_email(session_params[:email])
        # set the password in order to login and pass validation when resetting session token
        user.password = session_params[:password]

        return render json: { message: "user does not exist" }, status: 400 if user.nil?

        authenticated_user = user.authenticate(session_params[:password])

        return render json: { message: "invalid credentials" }, status: 400 if !authenticated_user

        login(user)

        render json: { message: "login successful" }, status: 200
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
