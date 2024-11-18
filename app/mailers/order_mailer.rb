class OrderMailer < ApplicationMailer
    def order_received
        @line_items = params[:line_items]
        @order = params[:order]
        email = params[:stripe_customer_email]

        if email.blank?
            puts "No stripe customer email found for the customer: Order##{@order.id}"

            return
        end

        mail to: email, subject: "Order received"
    end

    def order_active
        @order = params[:order]
        @line_items = @order.stripe_checkout_session_line_items
        email = @order.user.present? ? @order.user.email_address : @order.guest_email

        if email.blank?
            puts "No stripe customer email found for the customer: Order##{@order.id}"

            return
        end

        mail to: email, subject: "Order Being Prepared"
    end

    def order_in_transit
        @order = params[:order]
        @line_items = @order.stripe_checkout_session_line_items
        email = @order.user.present? ? @order.user.email_address : @order.guest_email

        if email.blank?
            puts "No stripe customer email found for the customer: Order##{@order.id}"

            return
        end

        mail to: email, subject: "Order In-Transit!"
    end
end
