class OrderMailer < ApplicationMailer
    def order_received
        @line_items = params[:line_items]
        @order = params[:order]
        email = params[:stripe_customer_email]

        if email.blank?
            puts "No stripe customer email found for the customer: Order##{@order.id}"

            return
        end

        mail(
            to: email,
            subject: "Order received"
        )
    end

    def order_active
        @line_items = params[:line_items]
        @order = params[:order]
        email = params[:email_to]

        if email.blank?
            puts "No stripe customer email found for the customer: Order##{@order.id}"

            return
        end

        mail(
            to: email,
            subject: "Order Being Prepared"
        )
    end
end
