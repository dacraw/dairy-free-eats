require 'rails_helper'
require "./spec/support/vcr"

RSpec.feature "Signups", type: :feature do
  let(:password) { Faker::Internet.password min_length: 8 }

  context "when the signup is successful" do
    let(:email) { "some@email.com" }
    it "signs up a new user and redirects to the order page" do
      visit signup_path

      expect {
        expect(page).to have_content("Sign up for an account")

        VCR.use_cassette "signup_feature_spec" do
          # Commenting this out to make demo'ing easier
          # fill_in "address.city", with: "Some City"
          # fill_in "address.country", with: ""
          # fill_in "address.country", with: "Some Country"
          # fill_in "address.line1", with: "Some address"
          # fill_in "address.line2", with: "Some additional address"
          # fill_in "address.postalCode", with: "12345"
          # fill_in "name", with: "Some Name"
          # fill_in "phone", with: "123-456-7890"

          fill_in "email", with: email
          fill_in "password", with: password
          fill_in "passwordConfirmation", with: password

          find("input[type='submit']").click

          expect(page).to have_content "Welcome to the order page!"

          expect(current_path).to eq order_path
        end
      }.to change { User.count }.from(0).to(1)

      expect(User.last.email).to eq email
      expect(User.last.stripe_customer_id).to be_present
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
