require "rails_helper"

RSpec.describe "Order Messages Resolver" do
    let(:query) {
        <<-GRAPHQL
            query FetchOrderMessages($orderId: ID!){
                orderMessages(orderId: $orderId){
                    id
                    body
                    createdAt
                    userIsAdmin
                }
            }
        GRAPHQL
    }

    def perform_query(json_params)
        post graphql_path, headers: { "Content-Type": "application/json" }, params: json_params

        JSON.parse(response.body)["data"]
    end

    it "returns order messages" do
        order = create :order, :with_a_user, :with_line_items, :with_order_messages
        params = { query: query, variables: { orderId: order.id } }

        data = perform_query params.to_json

        order_messages = data["orderMessages"]
        expect(order_messages.first["id"].to_i).to eq order.order_messages.first.id
        expect(order_messages.first["body"]).to eq order.order_messages.first.body
        expect(order_messages.first["userIsAdmin"]).to eq order.order_messages.first.user.admin
    end
end
