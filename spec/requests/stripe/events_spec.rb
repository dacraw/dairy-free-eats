require 'rails_helper'
require "./spec/support/vcr"
require "./spec/support/stripe/event_helper"

RSpec.describe "Stripe::EventsController", type: :request do
  def bypass_event_signature(payload)
    event = Stripe::Event.construct_from(JSON.parse(payload, symbolize_keys: true))
    expect(Stripe::Webhook).to receive(:construct_event) { event }
  end

  describe "POST /stripe/events" do
    context "payment_intent.succeeded" do
      context "when there is a customer" do
        let(:cassette_name) { "event_payment_intent_succeeded_checkout" }
        let(:mailer_double) { double(OrderMailer) }
        let(:admin_mailer_double) { double(Admin::OrderMailer) }

        it "creates an order" do
          # Use a payment intent generated through the Stripe Checkout page
          # This more accurately reflects a successful payment intent, versus creating one manually using VCR
          payload = File.read("spec/fixtures/stripe/event_payment_intent_succeeded.json")
          bypass_event_signature payload

          event = JSON.parse(payload)

          expect(event["data"]["object"]["metadata"]["RAILS_ENV"]).to eq Rails.env

          # Mock mailers now for expectation later
          allow(OrderMailer).to receive(:with) { mailer_double }
          allow(mailer_double).to receive(:order_received) { mailer_double }
          allow(mailer_double).to receive(:deliver_later) { mailer_double }

          allow(Admin::OrderMailer).to receive(:with) { admin_mailer_double }
          allow(admin_mailer_double).to receive(:order_received) { admin_mailer_double }
          allow(admin_mailer_double).to receive(:deliver_later) { admin_mailer_double }

          # Use VCR for the manually pinged Stripe::Checkout::Session.list payment_intent: "pi_..."
          # Where the PI ID is used from the above json mock payment intent
          VCR.use_cassette cassette_name do
            expect {
              post "/stripe/events", params: event
            }.to change { Order.count }.from(0).to(1)
          end

          expect(Order.last.stripe_payment_intent_id).to eq event["data"]["object"]["id"]
          expect(event["data"]["object"]["customer"]).to be_present

          # Parse the cassette contents to match against the actual request
          cassette_contents = YAML.load_file("./spec/cassettes/#{cassette_name}.yml")

          # The parsed checkout from the cassette
          response_checkout_session = Stripe::Checkout::Session.construct_from(
            JSON.parse(
              cassette_contents["http_interactions"].first["response"]["body"]["string"]
            )
          )

          # The parsed line items from the cassette contents
          response_checkout_line_items = JSON.parse(
            cassette_contents["http_interactions"].last["response"]["body"]["string"],
            symbolize_names: true
          )

          # Ensure that the Order has its line items matching those from the
          expected_checkout_line_items = response_checkout_line_items[:data].map do |item|
            { "name" => item[:description], "quantity" => item[:quantity] }
          end

          order = Order.last

          expect(order.stripe_checkout_session_line_items)
          .to eq(expected_checkout_line_items)

          # Expect mailers to have been called
          expect(OrderMailer).to have_received(:with).with(
            order: order,
            stripe_customer_email: response_checkout_session["data"].first["customer_details"]["email"],
            line_items: order.stripe_checkout_session_line_items
          )
          expect(mailer_double).to have_received(:order_received)
          expect(mailer_double).to have_received(:deliver_later)

          expect(Admin::OrderMailer).to have_received(:with).with(
            order: order,
            stripe_customer_email: response_checkout_session["data"].first["customer_details"]["email"],
            line_items: order.stripe_checkout_session_line_items
          )
          expect(mailer_double).to have_received(:order_received)
          expect(mailer_double).to have_received(:deliver_later)
        end
      end
    end
  end
end
