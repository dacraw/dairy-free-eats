require "rails_helper"

RSpec.describe("Order Resolver Spec") do
    let(:query) {
        <<-GRAPHQL
            query FetchCurrentUserOrders($completed: Boolean!) {
                currentUserOrders(completed: $completed) {
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
                guestEmail
                }
            }
        GRAPHQL
    }

    def perform_query(json_params)
        post graphql_path, headers: { "Content-Type": "application/json" }, params: json_params

        JSON.parse(response.body)["data"]
    end

    context "when there is no current user" do
        it "returns nil when current user is not present" do
            params = { query: query, variables: { completed: false } }

            perform_query params.to_json

            expect(JSON.parse(response.body)["currentUserOrders"]).to be nil
        end
    end

    context "when there is a current user" do
        let(:user) { create :user, :valid_user }

        before(:each) do
            login_user user
        end

        context "when the user has completed orders" do
            let!(:order) { create :order, :with_line_items, :completed, user_id: user.id }

            it "returns the orders" do
                params = { query: query, variables: { completed: true } }

                data = perform_query params.to_json

                orders = data["currentUserOrders"]

                expect(orders.first["id"].to_i).to eq order.id
                expect(orders.first["status"]).to eq order.status
                expect(orders.first["stripeCheckoutSessionLineItems"]).to eq order.stripe_checkout_session_line_items
                expect(orders.first["user"]["id"].to_i).to eq order.user.id
                expect(orders.first["user"]["email"]).to eq order.user.email_address
            end
        end

        context "when the user has incomplete orders" do
            let!(:order) { create :order, :with_line_items, :active, user_id: user.id }

            it "returns the orders" do
                params = { query: query, variables: { completed: false } }

                data = perform_query params.to_json

                orders = data["currentUserOrders"]

                expect(orders.first["id"].to_i).to eq order.id
                expect(orders.first["status"]).to eq order.status
                expect(orders.first["stripeCheckoutSessionLineItems"]).to eq order.stripe_checkout_session_line_items
                expect(orders.first["user"]["id"].to_i).to eq order.user.id
                expect(orders.first["user"]["email"]).to eq order.user.email_address
            end
        end
    end
end
