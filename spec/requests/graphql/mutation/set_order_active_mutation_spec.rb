require "rails_helper"

RSpec.describe "Set Order Active Mutation Spec" do
   let(:query) {
      <<-GRAPHQL
         mutation SetOrderActive($input: SetOrderActiveInput!){
            setOrderActive(input: $input){
               order {
                  id
                  status
               }
            }
         }
      GRAPHQL
   }

   context "when the current user is not an admin user" do
      let(:order) { create :order, :with_line_items }
      let(:user) { create :user, :valid_user }

      it "raises an error" do
         login_user user

         expect {
            post "/graphql", params: { query: query, variables: { input: { id: order.id } } }
         }.not_to change { order.status }

         graphql_response = JSON.parse(response.body)
         expect(graphql_response["errors"].first["message"]).to eq "Only admins can perform this action."
         expect(order.received?).to be true
      end
   end

   context "when the current user is an admin" do
      let(:user) { create :user, :valid_user, admin: true }

      before(:each) do
         login_user user
      end

      context "when the order does not exist" do
         it "returns an error" do
            post graphql_path, params: { query: query, variables: { input: { id: 12345 } } }

            graphql_response = JSON.parse(response.body)
            expect(graphql_response["errors"].first["message"]).to eq "The order does not exist."
         end
      end

      context "when the order is not in the received status" do
         let(:order) { create :order, :with_line_items, :active }

         it "returns an error" do
            post graphql_path, params: { query: query, variables: { input: { id: order.id } } }

            graphql_response = JSON.parse(response.body)

            expect(graphql_response["errors"].first["message"]).to eq "The order is not in the received status."
         end
      end

      context "when the mutation is successful" do
         let(:order) { create :order, :with_line_items }

         it "sets the order status to active" do
            expect {
               post graphql_path, params: { query: query, variables: { input: { id: order.id } } }
            }.to change { order.reload.status }.from("received").to("active")

            graphql_response = JSON.parse(response.body)

            graphql_order = graphql_response["data"]["setOrderActive"]["order"]
            expect(graphql_order["id"].to_i).to eq order.id
            expect(graphql_order["status"]).to eq order.status
         end
      end
   end
end
