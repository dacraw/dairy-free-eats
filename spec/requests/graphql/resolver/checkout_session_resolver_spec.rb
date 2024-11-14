require 'rails_helper'

RSpec.describe "CheckoutSessionResolver", type: :request do
  let(:query) {
    <<-GRAPHQL
      query FetchStripeCheckoutSession($id: ID!) {
        fetchCheckoutSession(id: $id){
          id
          amountTotal
          lineItems {
            id
            amountTotal
            description
            quantity
          }
        }
      }
    GRAPHQL
  }

  let(:cassette_name) { "checkout_session_resolver_spec" }

  it "returns a checkout session with the given id" do
    stripe_checkout_session_mock_json = File.read("spec/fixtures/stripe/stripe_checkout_session_customer_present.json")
    stripe_checkout_session = Stripe::Checkout::Session.construct_from(JSON.parse(stripe_checkout_session_mock_json))
    expect(Stripe::Checkout::Session).to receive(:retrieve).with(stripe_checkout_session.id) { stripe_checkout_session }

    stripe_checkout_session_line_items_mock_json = File.read("spec/fixtures/stripe/stripe_checkout_session_line_items.json")
    stripe_checkout_session_line_items = Stripe::ListObject.construct_from(JSON.parse(stripe_checkout_session_line_items_mock_json))
    expect(Stripe::Checkout::Session).to receive(:list_line_items) { stripe_checkout_session_line_items }

    post graphql_path, params: {
      query: query,
      variables: {
        id: stripe_checkout_session.id
      }
    }

    graphql_fetch_checkout_session = JSON.parse(
      response.body,
      symbolize_names: true
    )[:data][:fetchCheckoutSession]

    expect(graphql_fetch_checkout_session[:id]).to eq stripe_checkout_session.id

    expect(
      graphql_fetch_checkout_session[:lineItems]
      .pluck(:id, :amount_total, :description, :quantity)
    ).to match_array(
      stripe_checkout_session_line_items.pluck(:id, :amountTotal, :description, :quantity))
  end
end
