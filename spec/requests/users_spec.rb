require 'rails_helper'
require "./spec/support/vcr"

RSpec.describe "Users", type: :request do
  describe "POST /create" do
    let(:cassette_name) { "users_create_spec" }
    let(:password) { Faker::Internet.password min_length: 8 }

    it "creates and signs in a user in the app and Stripe" do
      params = {
        user: {
          email_address: "user_create_test@test.com",
          password: password,
          password_confirmation: password
        }
      }

      VCR.use_cassette cassette_name do
        expect {
          post api_v1_users_path, params: params
        }.to change { User.count }.from(0).to(1)
      end

      data = JSON.parse(response.body)

      expect(data["message"]).to eq "success"
      expect(data["redirect_url"]).to eq order_path

      cassette_contents = YAML.load_file("spec/cassettes/#{cassette_name}.yml")

      cassette_stripe_customer = JSON.parse(cassette_contents["http_interactions"].first["response"]["body"]["string"])
      expect(cassette_stripe_customer["email"]).to eq User.last.email_address
    end
  end
end
