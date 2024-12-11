require "rails_helper"
require "./spec/support/vcr"

RSpec.feature "Order Page Spec", type: :feature do
    let(:user) { create :user, :valid_user }
    let!(:products) { create_list(:product, 2, :valid_product) }

    before(:each) do
        feature_login_user user
    end

    it "allows all cart manipulations to take place" do
        visit order_path

        expect(page).to have_content "Welcome to the order page!"

        products.each do |product|
            expect(page).to have_content product.stripe_name
        end

        fill_in(products.first.stripe_default_price_id, with: 1)

        click_button("add-to-cart-" + products.first.stripe_default_price_id)

        # expect page to have a notification
        expect(page).to have_content "#{products.first["stripe_name"]} x1 has been added to the cart!"

        shopping_cart_icon = find("svg[data-icon='cart-shopping']")
        shopping_cart_icon.click

        # ensure the item is in the cart with correct values
        shopping_cart_modal = find("#shopping-cart")
        expect(shopping_cart_modal).to have_content products.first["stripe_name"]
        expect(shopping_cart_modal).to have_content products.first["stripe_description"]

        formatted_amount = sprintf("$%.2f", products.first.stripe_price_unit_amount / 100.00)
        expect(shopping_cart_modal).to have_content formatted_amount
        expect(shopping_cart_modal).to have_content "Total: #{formatted_amount}"

        # ensure the cart item quantity can be increased
        plus_button = shopping_cart_modal.find("svg[data-icon='plus']")
        plus_button.click
        new_formatted_amount = sprintf("$%.2f", products.first.stripe_price_unit_amount / 100.00 * 2)
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
        expect(shopping_cart_modal).not_to have_content products.first.stripe_name
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
