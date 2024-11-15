require "rails_helper"

RSpec.describe "Orders Resolver Spec" do
    let(:query) {
        <<-GRAPHQL
            query FetchOrders {
                orders {
                    id
                    status
                    stripeCheckoutSessionLineItems {
                        name
                        quantity
                    }
                    user {
                        id
                        email
                    }
                }
            }
        GRAPHQL
    }

    it "returns orders" do
        orders = create_list :order, 2, :with_line_items, :with_a_user

        post graphql_path, params: { query: query }

        graphql_orders_response = JSON.parse(response.body)["data"]["orders"]
        expect(graphql_orders_response.map { |order| order["id"].to_i })
            .to match_array(orders.pluck(:id))
        expect(graphql_orders_response.map { |order| order["status"] })
            .to match_array(orders.pluck(:status))
        expect(graphql_orders_response.map { |order| order["user"]["id"].to_i })
            .to match_array(orders.pluck(:user_id))
        expect(graphql_orders_response.map { |order| order["user"]["email"] })
            .to match_array(orders.map { |order| order.user.email })
        expect(graphql_orders_response.map { |order| order["stripeCheckoutSessionLineItems"] })
            .to match_array(orders.map { |order| order.stripe_checkout_session_line_items })

        expect(graphql_orders_response.pluck("id").map(&:to_i)).to match_array orders.reverse.pluck(:id)
    end
end
