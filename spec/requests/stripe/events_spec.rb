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
      context "when there is no customer" do
        let(:stripe_object) {
          VCR.use_cassette "stripe_create_payment_intent_succeeded_no_customer" do
            payment_intent = Stripe::PaymentIntent.create({
              amount: 500,
              automatic_payment_methods: {
                enabled: true,
                allow_redirects: "never"
              },
              confirm: true,
              currency: 'usd',
              description: "This is is test mode payment intent with no customer.",
              payment_method: "pm_card_visa",
              shipping: {
                address: {
                  city: "San Francisco",
                  country: "US",
                  line1: "510 Townsend St",
                  lin2: nil,
                  postal_code: "94103",
                  state: "CA"
                },
                name: "Jenny Rosen"
              }
            })
          end
        }

        it "responds to payment_intent.succeeded" do
          webhook_request = Stripe::EventHelper.construct_event_request stripe_object, "payment_intent.succeeded"
          bypass_event_signature webhook_request.to_json

          expect {
            post "/stripe/events", params: webhook_request
          }.to change { Order.count }.from(0).to(1)

          expect(response.status).to eq 200
        end
      end

      context "when there is a customer" do
        let(:user) { create :user, :valid_user, email: "beebo@rado.com" }
        let(:stripe_customer) {
          VCR.use_cassette("stripe_create_customer") do
            Stripe::Customer.create({
              description: "This customer was created by specs for testing only.",
              email: "beebo@rado.com",
              name: "Sir Beebo Radoton",
              phone: "123-456-7890"
            })
          end
        }
        let(:stripe_payment_intent) {
          VCR.use_cassette "stripe_create_payment_intent_succeeded" do
            payment_intent = Stripe::PaymentIntent.create({
              amount: 500,
              automatic_payment_methods: {
                enabled: true,
                allow_redirects: "never"
              },
              confirm: true,
              currency: 'usd',
              customer: stripe_customer.id,
              description: "This is is test mode payment intent.",
              payment_method: "pm_card_visa",
              shipping: {
                address: {
                  city: "San Francisco",
                  country: "US",
                  line1: "510 Townsend St",
                  lin2: nil,
                  postal_code: "94103",
                  state: "CA"
                },
                name: "Jenny Rosen"
              }
            })
          end
        }

        it "creates an order" do
          webhook_request = Stripe::EventHelper.construct_event_request stripe_payment_intent, "payment_intent.succeeded"
          bypass_event_signature webhook_request.to_json

          expect {
            post "/stripe/events", params: webhook_request
          }.to change { Order.count }.from(0).to(1)
        end
      end
    end
  end
end
