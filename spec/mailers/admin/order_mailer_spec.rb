require "rails_helper"

RSpec.describe Admin::OrderMailer, type: :mailer do
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
      Admin::OrderMailer
        .with(
          order: order,
          line_items: order.stripe_checkout_session_line_items,
          stripe_checkout_session: stripe_checkout_session
        )
        .order_received
        .deliver_now
    }.to change { ActionMailer::Base.deliveries.length }.from(0).to(1)

    email = ActionMailer::Base.deliveries.first

    expect(email.to).to include Rails.application.credentials.dig(:admin_email)
    expect(email.subject).to eq "An order has been placed"

    email_body = email.html_part.body.decoded
    expect(email_body).to include "A User has placed an order"
    expect(email_body).to include order.id.to_s    
    expect(email_body).to include stripe_checkout_session.customer_details.email
    order.stripe_checkout_session_line_items.each do |item|
      expect(email_body).to include item["name"]
      expect(email_body).to include "x#{item["quantity"]}"
    end
  end
end
