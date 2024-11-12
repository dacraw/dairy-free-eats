class OrderMailer < ApplicationMailer
    def order_received
        @order = params[:order]

        checkout_session = Stripe::Checkout::Session.list(payment_intent: @order.stripe_payment_intent_id).first

        if checkout_session.blank?
            puts "No checkout session found for the customer"

            return
        end

        if @order.user.nil?
            email = checkout_session.customer_details.email
        else
            email = @order.user.email
        end

        mail(
            to: email,
            subject: "Order received"
        )
    end
end
