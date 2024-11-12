require 'rails_helper'
require "./spec/support/vcr"

RSpec.feature "Signups", type: :feature do
  let(:password) { Faker::Internet.password min_length: 8 }

  context "when the signup is successful" do
    it "signs up a new user and redirects to the order page" do
      visit signup_path

      cassette_file = YAML.load_file("./spec/cassettes/signup_feature_spec.yml")["http_interactions"]

      stripe_customer = JSON.parse(cassette_file.first["response"]["body"]["string"])
      stripe_product_list = JSON.parse(cassette_file.last["response"]["body"]["string"])

      expect {
        expect(page).to have_content("Sign up for an account")

        VCR.use_cassette "signup_feature_spec" do 
          fill_in "address.city", with: stripe_customer["address"]["city"]
          fill_in "address.country", with: ""
          fill_in "address.country", with: stripe_customer["address"]["country"]
          fill_in "address.line1", with: stripe_customer["address"]["line1"]
          fill_in "address.line2", with: stripe_customer["address"]["line2"]
          fill_in "address.postalCode", with: stripe_customer["address"]["postalCode"]
          fill_in "name", with: stripe_customer["name"]
          fill_in "phone", with: stripe_customer["phone"]

          fill_in "email", with: stripe_customer["email"]
          fill_in "password", with: password
          fill_in "passwordConfirmation", with: password

          find("input[type='submit']").click

          expect(page).to have_content "Welcome to the order page!"

          stripe_product_list["data"].each {|product| expect(page).to have_content product["name"] }
          
          expect(current_path).to eq order_path
        end

      }.to change { User.count }.from(0).to(1)

      expect(User.last.email).to eq stripe_customer["email"]
    end
  end

  context "when the signup fails" do
    let(:email) { Faker::Internet.email }

    it "renders errors and does not redirect" do
      expect(Stripe::Customer).not_to receive(:create)
      
      visit signup_path

      expect {
        expect(page).to have_content "Sign up for an account"

        fill_in "email", with: email
        fill_in "password", with: password
        fill_in "passwordConfirmation", with: "doesNotMatch"
        find("input[type='submit']").click

        expect(page).to have_content "Password Confirmation doesn't match Password"
      }.not_to change { User.count }

      expect(page).to have_content "Email"
      expect(page).to have_content "Password"
    end
  end
end
