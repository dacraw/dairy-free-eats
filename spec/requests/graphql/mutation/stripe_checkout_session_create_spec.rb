require 'rails_helper'

RSpec.describe "StripeCheckoutSessionCreate", type: :request do
  let(:query) {
    <<-GRAPHQL
      mutation StripeCheckoutSessionCreate($input: StripeCheckoutSessionCreateInput!)
      {
        stripeCheckoutSessionCreate(input: $input) {
          stripeCheckoutSession {
            url
          }
          errors {
            message
          }
        }
      }
    GRAPHQL
  }

  context "for a successful request" do
    let(:mock_checkout_url) { "www.checkoutpage.com" }
    let(:session_double) { double(Stripe::Checkout::Session, "url" => mock_checkout_url) }

    it "creates a successful stripe checkout session" do
      line_items = [
        { price: "price_12345", quantity: 1 },
        { price: "price_54321", quantity: 1 }
      ]

      params = {
        query: query,
        variables: {
          input: {
            stripeCheckoutSessionInput: {
              lineItems: line_items
            }
          }
        }
      }

      expect(Stripe::Checkout::Session)
        .to receive(:create)
        .with({
          success_url: "http://localhost:3000/success",
          cancel_url: "http://localhost:3000/order",
          line_items: line_items,
          mode: "payment",
          phone_number_collection: {
              enabled: true
          },
          customer_email: nil
        })
        .and_return(session_double)

      # Must specify the params as json so that GraphQL can parse the intergers correctly
      post "/graphql", headers: { "Content-Type": "application/json" }, params: params.to_json

      data = JSON.parse(response.body)["data"]

      expect(data["stripeCheckoutSessionCreate"]["stripeCheckoutSession"]["url"]).to eq mock_checkout_url
    end
  end

  context "for an unsuccessful request" do
    it "validates that price ids are formatted properly" do
      line_items = [
        { price: "bogus_12345", quantity: 1 },
        { price: "price_54321", quantity: 1 }
      ]

      params = {
        query: query,
        variables: {
          input: {
            stripeCheckoutSessionInput: {
              lineItems: line_items
            }
          }
        }
      }

      expect(Stripe::Checkout::Session).not_to receive(:create) { false }

      post "/graphql", headers: { "Content-Type": "application/json" }, params: params.to_json

      data = JSON.parse(response.body)["data"]

      expect(data["stripeCheckoutSessionCreate"]["stripeCheckoutSession"]).to be nil
      expect(data["stripeCheckoutSessionCreate"]["errors"]).to match_array([ { "message"=>"One of the entered keys doesn't represent a price id." } ])
    end

    it "validates that at least one quantity has been entered" do
      line_items = [
        { price: "price_12345", quantity: 0 },
        { price: "price_54321", quantity: 0 }
      ]

      params = {
        query: query,
        variables: {
          input: {
            stripeCheckoutSessionInput: {
              lineItems: line_items
            }
          }
        }
      }

      expect(Stripe::Checkout::Session).not_to receive(:create) { false }

      post "/graphql", headers: { "Content-Type": "application/json" }, params: params.to_json

      data = JSON.parse(response.body)["data"]

      expect(data["stripeCheckoutSessionCreate"]["stripeCheckoutSession"]).to be nil
      expect(data["stripeCheckoutSessionCreate"]["errors"]).to match_array([ { "message"=>"You must enter a quantity for at least one item." } ])
    end

    it "returns a generic error if the Stripe checkout session object cannot be created" do
      line_items = [
        { price: "price_12345", quantity: 1 },
        { price: "price_54321", quantity: 0 }
      ]

      params = {
        query: query,
        variables: {
          input: {
            stripeCheckoutSessionInput: {
              lineItems: line_items
            }
          }
        }
      }

      mock_error = Stripe::InvalidRequestError.new "error stub", "error stub 2"

      expect(Stripe::Checkout::Session).to receive(:create).and_raise(mock_error)

      post "/graphql", headers: { "Content-Type": "application/json" }, params: params.to_json

      data = JSON.parse(response.body)["data"]

      expect(data["stripeCheckoutSessionCreate"]["stripeCheckoutSession"]).to be nil
      expect(data["stripeCheckoutSessionCreate"]["errors"]).to match_array([ { "message"=>"Unfortunately, there is an issue with the Stripe checkout at this time. Please try again later." } ])
    end
  end
end
