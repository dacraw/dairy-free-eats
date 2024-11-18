require "rails_helper"

RSpec.describe OrderMailer, type: :mailer do
  context "#order_received" do
    let(:order) { create(:order, :with_line_items) }

    it "sends an email" do
      # Mocking Stripe::Checkout::Session without VCR
      # since it's impossible to connect a payment intent with a session outside of the UI
      checkout_session_mock_json = JSON.parse(
        File.read "./spec/fixtures/stripe/stripe_checkout_session_customer_present.json",
        symbolize_names: true
      )
      stripe_checkout_session = Stripe::Checkout::Session.construct_from(checkout_session_mock_json)
      stripe_checkout_list = Stripe::ListObject.construct_from({ data: [ checkout_session_mock_json ] })

      expect {
        OrderMailer
          .with(
            order: order,
            line_items: order.stripe_checkout_session_line_items,
            stripe_customer_email: stripe_checkout_session.customer_details.email
          )
          .order_received
          .deliver_now
      }.to change { ActionMailer::Base.deliveries.length }.from(0).to(1)

      email = ActionMailer::Base.deliveries.first

      expect(email.to).to include stripe_checkout_list.first.customer_details.email
      expect(email.subject).to eq "Order received"

      email_body = email.html_part.body.decoded
      expect(email_body).to include "Your order has been received"
      expect(email_body).to include order.id.to_s
    end
  end

  context "#order_active" do
    let(:order) { create :order, :with_line_items, guest_email: Faker::Internet.email }

    it "sends an email" do
      expect {
        OrderMailer
          .with(order: order)
          .order_active
          .deliver_now
      }.to change { ActionMailer::Base.deliveries.length }.from(0).to(1)

      email = ActionMailer::Base.deliveries.first

      expect(email.to).to include order.guest_email
      expect(email.subject).to eq "Order Being Prepared"

      email_body = email.html_part.body.decoded

      expect(email_body).to include "Order ##{order.id} is now being \"prepared\", aka it has been set to active."
      order.stripe_checkout_session_line_items.each do |item|
        expect(email_body).to include "#{item['name']} x#{item['quantity']}"
      end
    end
  end
end
