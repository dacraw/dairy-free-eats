require "rails_helper"

RSpec.describe("Order Resolver Spec") do
    let(:query) {
        <<-GRAPHQL
            query FetchCurrentUserOrders($incomplete: Boolean) {
                currentUserOrders(incomplete: $incomplete) {
                id
                status
                amountTotal
                stripeCheckoutSessionLineItems {
                    name
                    quantity
                    unitAmount
                    imageUrl
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
        it "raises an error" do
            params = { query: query, variables: { incomplete: false } }

            perform_query params.to_json

            message = JSON.parse(response.body)["errors"].first["message"]

            expect(message).to eq "A current user is not logged in."
        end
    end

    context "when there is a current user" do
        let(:user) { create :user, :valid_user }

        before(:each) do
            login_user user
        end

        context "when the incomplete argument is set to true" do
            let!(:order) { create :order, :with_line_items, :active, user_id: user.id }
            let!(:distractor) { create :order, :with_line_items, :completed, user_id: user }

            it "returns the orders" do
                params = { query: query, variables: { incomplete: true } }

                data = perform_query params.to_json

                orders = data["currentUserOrders"]


                expect(orders.first["id"].to_i).to eq order.id
                expect(orders.first["status"]).to eq order.status

                expected_line_items = orders.first["stripeCheckoutSessionLineItems"].map do |item|
                    item.transform_keys(&:underscore)
                end

                expect(expected_line_items).to eq order.stripe_checkout_session_line_items
                expect(orders.first["user"]["id"].to_i).to eq order.user.id
                expect(orders.first["user"]["email"]).to eq order.user.email_address


                expect(orders.pluck(:id).map(&:to_i)).not_to include distractor.id
            end
        end

        context "when no argument is passed to the query" do
            let!(:current_user_orders) {
                [
                    create(:order, :with_line_items, user_id: user.id),
                    create(:order, :with_line_items, :active, user_id: user.id),
                    create(:order, :with_line_items, :in_transit, user_id: user.id),
                    create(:order, :with_line_items, :completed, user_id: user.id),
                    create(:order, :with_line_items, :cancelled, user_id: user.id)
                ]
            }

            let!(:distractor) { create :order, :with_line_items, user: create(:user, :valid_user) }

            it "returns all of the current user's orders" do
                params = { query: query }

                data = perform_query params.to_json

                orders = data["currentUserOrders"]

                expect(orders.pluck("id").map(&:to_i)).to match_array(current_user_orders.pluck(:id))
                expect(orders.pluck("id").map(&:to_i)).not_to include distractor.id
            end
        end
    end
end
