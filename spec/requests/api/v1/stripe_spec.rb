require 'rails_helper'

RSpec.describe "Api::V1::Stripe", type: :request do
  describe "GET /products" do
    context "when there are no products" do
      let(:product_list_double) {
        double(
          Stripe::ListObject, 
          object: "list", 
          data: [],
          has_more: false,
          url: "/test/mock" 
        )
      }

      it "responds with an error" do
        expect(Stripe::Product).to receive(:list) { product_list_double }

        get api_v1_stripe_products_path

        expect(JSON.parse(response.body)["message"]).to eq "No products could be fetched"
      end
    end

    context "when there are products" do
      let(:mock_description_1) {"mock_description_1"}
      let(:mock_name_1) {"mock_name_1"}
      let(:mock_price_1) { "mock_price_1" }

      let(:mock_description_2) {"mock_description_2"}
      let(:mock_name_2) {"mock_name_2"}
      let(:mock_price_2) { "mock_price_2" }

      let(:product_list_double) {
        double(
          Stripe::ListObject, 
          object: "list", 
          data: [
            {
              "id":"prod_R8KkVOibvpRPlc",
              "object":"product",
              "active":true,
              "attributes":[],
              "created":1730403020,
              "default_price":mock_price_1,
              "description":mock_description_1,
              "images":[],
              "livemode":false,
              "marketing_features":[],
              "metadata":{},
              "name":mock_name_1,
              "package_dimensions":nil,
              "shippable":nil,
              "statement_descriptor":nil,
              "tax_code":"txcd_20030000",
              "type":"service",
              "unit_label":nil,
              "updated":1730403021,
              "url":nil
            },
            {
              "id":"prod_R8KiBa0tljS7SV",
              "object":"product",
              "active":true,
              "attributes":[],
              "created":1730402927,
              "default_price":mock_price_2,
              "description":mock_description_2,
              "images":[],
              "livemode":false,
              "marketing_features":[],
              "metadata":{},
              "name":mock_name_2,
              "package_dimensions":nil,
              "shippable":nil,
              "statement_descriptor":nil,
              "tax_code":"txcd_20030000",
              "type":"service",
              "unit_label":nil,
              "updated":1730402928,
              "url":nil
            }
          ],
          has_more: false,
          url: "/test/mock" 
        )
      }
      
      it "responds with necessary product information" do
        expect(Stripe::Product).to receive(:list) { product_list_double }
        
        get api_v1_stripe_products_path

        body = JSON.parse response.body

        expect(body[0]).to (match(
          { "name" => mock_name_1, "description" => mock_description_1, "default_price" => mock_price_1 }
        ))

        expect(body[1]).to (match(
          { "name" => mock_name_2, "description" => mock_description_2, "default_price" => mock_price_2 }
        ))
      end
    end
  end
end
