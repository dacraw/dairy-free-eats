require 'rails_helper'
require "./spec/support/vcr"

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
    context "when a current user is not present" do
      it "creates a successful stripe checkout session" do
        VCR.use_cassette "stripe_checkout_session_successful" do
          product_list = Stripe::Product.list
          line_items = product_list.data.map { |product| { price: product.default_price, quantity: 1 } }

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
          # Must specify the params as json so that GraphQL can parse the intergers correctly
          post "/graphql", headers: { "Content-Type": "application/json" }, params: params.to_json

          data = JSON.parse(response.body)["data"]
          graphql_response = data["stripeCheckoutSessionCreate"]["stripeCheckoutSession"]

          expect(graphql_response["url"]).to be_present
          expect(graphql_response["customer"]).to be nil
          checkout_session_json = YAML.load_file("./spec/cassettes/stripe_checkout_session_successful.yml")["http_interactions"].last["response"]["body"]["string"]
          stripe_checkout_session = JSON.parse(checkout_session_json, symbolize_names: true)
          expect(stripe_checkout_session[:phone_number_collection][:enabled]).to be true
        end
      end
    end

    context "when a current user is present" do
      let(:user) { create :user, :valid_user }

      it "creates a stripe checkout session" do
        VCR.use_cassette "stripe_checkout_session_customer_present" do
          customer = Stripe::Customer.create

          user.update(stripe_customer_id: customer.id)

          # Sign in user - convert this into a helper
          sign_in_query =
            <<-GRAPHQL
                mutation CreateSession($input: SessionCreateInput!) {
                    sessionCreate(input: $input){
                        user {
                            id
                        }
                        errors {
                            message
                            path
                        }
                    }
                }
            GRAPHQL

          sign_in_variables = {
            input: {
                sessionInput: {
                    email: user.email,
                    password: user.password
                }
            }
          }

          post "/graphql", params: { query: sign_in_query, variables: sign_in_variables }

          expect(controller.current_user).to be_present

          product_list = Stripe::Product.list
          line_items = product_list.data.map { |product| { price: product.default_price, quantity: 1 } }

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
          # Must specify the params as json so that GraphQL can parse the intergers correctly
          post "/graphql", headers: { "Content-Type": "application/json" }, params: params.to_json

          data = JSON.parse(response.body)["data"]
          graphql_response = data["stripeCheckoutSessionCreate"]["stripeCheckoutSession"]

          expect(graphql_response["url"]).to be_present

          stripe_checkout_session_json = YAML.load_file("./spec/cassettes/stripe_checkout_session_customer_present.yml")["http_interactions"].last["response"]["body"]["string"]

          stripe_checkout_session = JSON.parse(stripe_checkout_session_json, symbolize_names: true)

          expect(graphql_response["url"]).to eq stripe_checkout_session[:url]
          expect(stripe_checkout_session[:customer]).to eq user.stripe_customer_id
        end
      end
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
