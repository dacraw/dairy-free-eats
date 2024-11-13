class OrderMailer < ApplicationMailer
    def order_received
        @line_items = params[:line_items]
        @order = params[:order]
        stripe_checkout_session = params[:stripe_checkout_session]

        if stripe_checkout_session.blank?
            puts "No checkout session found for the customer"

            return
        end

        mail(
            to: stripe_checkout_session.customer_details.email,
            subject: "Order received"
        )
    end
end
