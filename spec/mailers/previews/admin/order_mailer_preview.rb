# Preview all emails at http://localhost:3000/rails/mailers/admin/order_mailer
class Admin::OrderMailerPreview < ActionMailer::Preview
    def order_received
        checkout_session_mock_json = JSON.parse(
            File.read "./spec/fixtures/stripe/stripe_checkout_session_customer_present.json",
            symbolize_names: true
        )

        stripe_checkout_session = Stripe::Checkout::Session.construct_from(checkout_session_mock_json)
        order = Order.last
        line_items = order.stripe_checkout_session_line_items

        Admin::OrderMailer
            .with(
                order: order,
                stripe_checkout_session: stripe_checkout_session,
                line_items: line_items
            )
            .order_received
    end
end