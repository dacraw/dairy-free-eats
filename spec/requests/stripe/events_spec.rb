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
      let(:cassette_name) { "event_payment_intent_succeeded_checkout" }

      # Using a mock payment intent succeeded event for a Stripe Checkout performed through the UI
      # This is used to construct the event sent to the website
      # VCR is used later to fetch the completed Stripe Checkout associated with this event
      # and again to fetch the line items for the Stripe Checkout.
      # If, for whatever reason, this payment intent event is deleted, just re-do a Stripe Checkout and get the event
      let(:payload) { File.read("spec/fixtures/stripe/event_payment_intent_succeeded.json") }

      # This is the JSON that will be passed into the events#create route to continue the webhook response
      let(:event) { JSON.parse(payload) }

      # The response from the cassette will be used to assert the values for events performed by our server
      let(:cassette_contents)  { YAML.load_file("./spec/cassettes/#{cassette_name}.yml") }

      # The below variables represent the objects as they would be returned by a Stripe API call,
      # parsed from the contents of the VCR cassette
      let(:response_checkout_session) {
        Stripe::Checkout::Session.construct_from(
          JSON.parse(
            cassette_contents["http_interactions"].first["response"]["body"]["string"]
          )
        )
      }

      let(:response_checkout_line_items) {
        JSON.parse(
          cassette_contents["http_interactions"].last["response"]["body"]["string"],
          symbolize_names: true
        )
      }

      before(:each) do
        bypass_event_signature payload
      end

      it "sends an email to the admin user" do
        admin_mailer_double = double(Admin::OrderMailer)

        allow(Admin::OrderMailer).to receive(:with) { admin_mailer_double }
        allow(admin_mailer_double).to receive(:order_received) { admin_mailer_double }
        allow(admin_mailer_double).to receive(:deliver_later) { admin_mailer_double }

        VCR.use_cassette cassette_name do
          expect {
            post "/stripe/events", params: event
          }.to change { Order.count }.from(0).to(1)
        end

        order = Order.last

        expect(Admin::OrderMailer).to have_received(:with).with(
          order: order,
          stripe_customer_email: response_checkout_session["data"].first["customer_details"]["email"],
          line_items: order.stripe_checkout_session_line_items
        )
        expect(admin_mailer_double).to have_received(:order_received)
        expect(admin_mailer_double).to have_received(:deliver_later)
      end

      it "sends an email to the customer" do
        mailer_double = double(OrderMailer)

        allow(OrderMailer).to receive(:with) { mailer_double }
        allow(mailer_double).to receive(:order_received) { mailer_double }
        allow(mailer_double).to receive(:deliver_later) { mailer_double }

        VCR.use_cassette cassette_name do
          expect {
            post "/stripe/events", params: event
          }.to change { Order.count }.from(0).to(1)
        end

        order = Order.last

        expect(OrderMailer).to have_received(:with).with(
          order: order,
          stripe_customer_email: response_checkout_session["data"].first["customer_details"]["email"],
          line_items: order.stripe_checkout_session_line_items
        )
        expect(mailer_double).to have_received(:order_received)
        expect(mailer_double).to have_received(:deliver_later)
      end

      it "creates a order for a guest (no User registered with the stripe customer id)" do
        expect(event["data"]["object"]["metadata"]["RAILS_ENV"]).to eq Rails.env

        VCR.use_cassette cassette_name do
          expect {
            post "/stripe/events", params: event
          }.to change { Order.count }.from(0).to(1)
        end

        order = Order.last

        expect(order.stripe_payment_intent_id).to eq event["data"]["object"]["id"]
        expect(event["data"]["object"]["customer"]).to be_present
        expect(order.stripe_checkout_session_line_items)
          .to eq(order.stripe_checkout_session_line_items)
        expect(order.guest_email).to eq(response_checkout_session["data"].first["customer_details"]["email"])
      end

      it "creates a order for a User (User in this app has a stripe id associated before the order is created)" do
        user = create :user, :valid_user, stripe_customer_id: event["data"]["object"]["customer"]

        expect(event["data"]["object"]["metadata"]["RAILS_ENV"]).to eq Rails.env

        VCR.use_cassette cassette_name do
          expect {
            post "/stripe/events", params: event
          }.to change { Order.count }.from(0).to(1)
        end

        order = Order.last

        expect(order.stripe_payment_intent_id).to eq event["data"]["object"]["id"]
        expect(event["data"]["object"]["customer"]).to be_present
        expect(order.stripe_checkout_session_line_items)
          .to eq(order.stripe_checkout_session_line_items)

        # Technically, the user email should equal that in the Stripe checkout
        # Due to the order of the mocking, it makes sense to ensure the order points to the created user
        # and the guest email is blank, because this ensures that the user created in this spec was assigned to the order
        expect(order.user).to eq user
        expect(order.guest_email).to be nil
      end
    end
  end
end
