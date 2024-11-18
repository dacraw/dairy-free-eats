require "rails_helper"

RSpec.describe("Order Resolver Spec") do
    let(:query) {
        <<-GRAPHQL
            query FetchOrder($id: ID!){
                order(id: $id) {
                    id
                    user {
                        id
                    }
                    status
                    stripePaymentIntentId
                    createdAt
                    updatedAt
                    stripeCheckoutSessionLineItems {
                        name
                        quantity
                    }
                    guestEmail
                }
            }
        GRAPHQL
    }

    context "when a valid id argument is provided" do
        # Please note that this mock order has a guest_email and a user; this is impossible with the events_controller logic
        # However, I do want to test that the value is being returned properly from the resolver
        let(:order) { create :order, :with_a_user, :with_line_items, guest_email: Faker::Internet.email }

        it "returns the order field" do
            post graphql_path, params: { query: query, variables: { id: order.id } }

            gql_order = JSON.parse(response.body)["data"]["order"]

            expect(gql_order["id"].to_i).to eq order.id
            expect(gql_order["user"]["id"].to_i).to eq order.user.id
            expect(gql_order["status"]).to eq order.status
            expect(gql_order["stripePaymentIntentId"]).to eq order.stripe_payment_intent_id
            expect(gql_order["createdAt"]).to eq order.created_at.strftime "%Y-%m-%d"
            expect(gql_order["updatedAt"]).to eq order.updated_at.strftime "%Y-%m-%d"
            expect(gql_order["stripeCheckoutSessionLineItems"]).to match_array(order.stripe_checkout_session_line_items)
            expect(gql_order["guestEmail"]).to eq order.guest_email
        end
    end

    context "when an invalid id argument is provided" do
        it "returns an errors field" do
            post graphql_path, params: { query: query, variables: { id: "not_even_an_id" } }

            gql_error = JSON.parse(response.body)["errors"].first

            expect(gql_error["message"]).to eq "Order not_even_an_id not found"
        end
    end
end
