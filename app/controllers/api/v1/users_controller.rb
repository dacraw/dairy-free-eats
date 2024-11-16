class Api::V1::UsersController < ApplicationController
    def new
    end

    def create
        user = User.new(user_params)

        if user.save
            start_new_session_for user

            stripe_customer = ::Stripe::Customer.create({
                # address will not be stored in app database, it's only being used to setup the Stripe Customer
                email: user_params[:email_address]
                # commenting out these fields to make demo'ing the site easier
                # address: { **user_input.address },
                # phone: user_input.phone,
                # name: user_input.name,
            })

            if !user.update(stripe_customer_id: stripe_customer.id)
                return render json: { message: "failed", errors: [ { message: "Could not update the user's stripe customer id" }]}, status: 500
            end

            render json: { message: "success", redirect_url: URI(order_url).path }, status: 200
        else
            render json: { message: "failed", errors: user.errors.full_messages }
        end
    end

    private
    def user_params
        params.require(:user).permit(:email_address, :password, :password_confirmation)
    end
end
