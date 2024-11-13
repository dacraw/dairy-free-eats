class OrderMailer < ApplicationMailer
    def order_received
        @order = params[:order]

        checkout_session = Stripe::Checkout::Session.list(payment_intent: @order.stripe_payment_intent_id).first

        if checkout_session.blank?
            puts "No checkout session found for the customer"

            return
        end

        mail(
            to: checkout_session.customer_details.email,
            subject: "Order received"
        )
    end
end
