require "rails_helper"

RSpec.describe "Create Order Message Mutation" do
    let(:order) { create :order, :with_line_items, :with_a_user }
    let(:query) {
        <<-GRAPHQL
            mutation CreateOrderMessaage($input:CreateOrderMessageInput!){
                createOrderMessage(input: $input){
                    orderMessage {
                      id
                    }
                }
            }#{'            '}
        GRAPHQL
     }

    it "creates an order message for an existing order" do
        params = {
            query: query,
            variables: {
                input: {
                    createOrderMessageInputType: {
                      body: "hey ya'll",
                      userId: order.user.id,
                      orderId: order.id
                    }
                }
            }
        }

        expect {
            post graphql_url,
                headers: { "Content-Type": "application/json" },
                params: params.to_json
        }.to change { OrderMessage.count }.from(0).to(1)

        order_message = OrderMessage.last
        gql_order_message = JSON.parse(response.body)["data"]["createOrderMessage"]["orderMessage"]

        expect(gql_order_message["id"].to_i).to eq order_message.id
        expect(order.reload.order_messages.length).to eq 1
        expect(order.reload.order_messages.first).to eq order_message
    end
end
