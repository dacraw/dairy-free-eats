require 'rails_helper'

RSpec.feature "Signups", type: :feature do
  let(:email) { Faker::Internet.email }
  let(:password) { Faker::Internet.password min_length: 8 }
  
  let(:mock_description_1) { "mock_description_1" }
  let(:mock_name_1) { "mock_name_1" }
  let(:mock_price_1) { "mock_price_1" }

  let(:mock_description_2) { "mock_description_2" }
  let(:mock_name_2) { "mock_name_2" }
  let(:mock_price_2) { "mock_price_2" }

  let(:product_list_double) {
    double(
      Stripe::ListObject,
      object: "list",
      data: [
        {
          "id": "prod_12345",
          "object": "product",
          "active": true,
          "attributes": [],
          "created": 1730403020,
          "default_price": mock_price_1,
          "description": mock_description_1,
          "images": [],
          "livemode": false,
          "marketing_features": [],
          "metadata": {},
          "name": mock_name_1,
          "package_dimensions": nil,
          "shippable": nil,
          "statement_descriptor": nil,
          "tax_code": "txcd_20030000",
          "type": "service",
          "unit_label": nil,
          "updated": 1730403021,
          "url": nil
        },
        {
          "id": "prod_12345",
          "object": "product",
          "active": true,
          "attributes": [],
          "created": 1730402927,
          "default_price": mock_price_2,
          "description": mock_description_2,
          "images": [],
          "livemode": false,
          "marketing_features": [],
          "metadata": {},
          "name": mock_name_2,
          "package_dimensions": nil,
          "shippable": nil,
          "statement_descriptor": nil,
          "tax_code": "txcd_20030000",
          "type": "service",
          "unit_label": nil,
          "updated": 1730402928,
          "url": nil
        }
      ],
      has_more: false,
      url: "/test/mock"
    )
  }

  context "when the signup is successful" do
    it "signs up a new user and redirects to the order page" do
      expect(Stripe::Product).to receive(:list) { product_list_double }
      visit signup_path

      expect {
        expect(page).to have_content("Sign up for an account")
    
        fill_in "email", with: email
        fill_in "password", with: password
        fill_in "passwordConfirmation", with: password
        find("input[type='submit']").click
    
        expect(page).to have_content "Welcome to the order page!"
        expect(page).to have_content mock_name_1
        expect(current_path).to eq order_path
      }.to change { User.count }.from(0).to(1)

      expect(User.last.email).to eq email
    end
  end

  context "when the signup fails" do
    it "renders errors and does not redirect" do
      visit signup_path

      expect {
        expect(page).to have_content "Sign up for an account"
        
        fill_in "email", with: email
        fill_in "password", with: password
        fill_in "passwordConfirmation", with: "doesNotMatch"
      }.not_to change { User.count }
    end
  end
end
