require "rails_helper"

RSpec.describe "Orders Resolver Spec" do
    let(:query) {
        <<-GRAPHQL
            query FetchOrders {
                orders {
                    id
                    status
               }
            }
        GRAPHQL
    }

    it "returns orders" do
        orders = create_list :order, 2, :with_line_items

        post graphql_path, params: { query: query }

        graphql_response = JSON.parse(response.body)
        expect(graphql_response["data"]["orders"].map { |order| order["id"].to_i })
            .to match_array(orders.pluck(:id))
    end
end
