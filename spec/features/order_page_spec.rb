require "rails_helper"
require "./spec/support/vcr"

RSpec.feature "Order Page Spec", type: :feature do
    let(:user) { create :user, :valid_user }

    before(:each) do
        feature_login_user user
    end

    it "allows all cart manipulations to take place" do
        VCR.use_cassette "order_page_spec" do
            visit order_path

            expect(page).to have_content "Welcome to the order page!"
        end

        cassette = YAML.load_file "spec/cassettes/order_page_spec.yml"
        products = JSON.parse(cassette["http_interactions"].first["response"]["body"]["string"])["data"]
        fill_in(products.first["default_price"]["id"], with: 1)

        click_button("add-to-cart-" + products.first["default_price"]["id"])

        # expect page to have a notification
        expect(page).to have_content "#{products.first["name"]} x1 has been added to the cart!"

        shopping_cart_icon = find("svg[data-icon='cart-shopping']")
        shopping_cart_icon.click

        # ensure the item is in the cart with correct values
        shopping_cart_modal = find("#shopping-cart")
        expect(shopping_cart_modal).to have_content products.first["name"]
        expect(shopping_cart_modal).to have_content products.first["description"]

        formatted_amount = sprintf("$%.2f", products.first["default_price"]["unit_amount"] / 100.00)
        expect(shopping_cart_modal).to have_content formatted_amount
        expect(shopping_cart_modal).to have_content "Total: #{formatted_amount}"

        # ensure the cart item quantity can be increased
        plus_button = shopping_cart_modal.find("svg[data-icon='plus']")
        plus_button.click
        new_formatted_amount = sprintf("$%.2f", products.first["default_price"]["unit_amount"] / 100.00 * 2)
        expect(shopping_cart_modal).to have_content new_formatted_amount
        expect(shopping_cart_modal).to have_content "Total: #{new_formatted_amount}"

        # ensure the cart item quantity can be decreased
        minus_button = shopping_cart_modal.find("svg[data-icon='minus']")
        minus_button.click
        expect(shopping_cart_modal).to have_content formatted_amount # re-using the original variable
        expect(shopping_cart_modal).to have_content "Total: #{formatted_amount}"

        # ensure the cart item can be deleted
        trash_can_button = shopping_cart_modal.find("svg[data-icon='trash']")
        trash_can_button.click
        expect(shopping_cart_modal).to have_content "Your cart currently has no items."
        expect(shopping_cart_modal).not_to have_content products.first["name"]
        expect(shopping_cart_modal).to have_link "Order Page"

        VCR.use_cassette "dummy_order_page_success" do
            # ensure the shopping cart is cleared upon visiting the order success page
            # the idea here is to skip checking out by using Stripe checkout
            # We don't care if the session is retrieved or not, we only care here that the cart is empty.
            visit success_path checkout_id: "12345"
            expect(page).to have_content "There was an issue retrieving the Stripe order."
            find("svg[data-icon='cart-shopping']").click
            expect(shopping_cart_modal).to have_content "Your cart currently has no items."
        end
    end
end
