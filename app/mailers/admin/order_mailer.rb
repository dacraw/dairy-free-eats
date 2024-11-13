class Admin::OrderMailer < ApplicationMailer
    def order_received
        @line_items = params[:line_items]
        @order = params[:order]
        @email = params[:stripe_customer_email]

        if @email.blank?
            puts "No stripe customer email found for the customer. Order#: #{@order.id}"

            return
        end

        mail(
            to: Rails.application.credentials.dig(:admin_email),
            subject: "An order has been placed"
        )
    end
end
