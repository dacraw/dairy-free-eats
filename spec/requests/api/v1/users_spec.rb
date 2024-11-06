require 'rails_helper'

RSpec.describe "API::V1::Users", type: :request do
  describe "POST /create" do
    context "with valid params" do
      let(:valid_params) {
        { user: { email: "test@somewhere.com", password: "password", password_confirmation: "password" } }
      }

      it "creates a user" do
        expect {
          post api_v1_users_url,
            params: valid_params
        }.to change { User.count }.from(0).to(1)
      end

      it "logs in the user" do
        post api_v1_users_url, params: valid_params

        user = User.last
        expect(user.session_token).to eq session[:session_token]
        expect(controller.logged_in?).to eq true
        expect(controller.current_user).to eq user
      end
    end

    context "when there is an issue with the password" do
      it "expects password to be present" do
        expect {
          post api_v1_users_url, params: { user: { email: "test@somewhere.com", password_confirmation: "password" } }
        }.not_to change { User.count }

        expect(response.status).to eq 400

        body = JSON.parse response.body
        expect(body["message"]).to eq "user was not created"
        expect(body["errors"]).to include "Password can't be blank"
      end

      it "expects password to be at least 8 characters long" do
        expect {
          post api_v1_users_url, params: { user: { email: "test@somewhere.com", password: "short", password_confirmation: "short" } }
        }.not_to change { User.count }

        expect(response.status).to eq 400

        body = JSON.parse response.body
        expect(body["message"]).to eq "user was not created"
        expect(body["errors"]).to include "Password is too short (minimum is 8 characters)"
      end

      it "expects password confirmation to be present" do
        expect {
          post api_v1_users_url, params: { user: { email: "test@somewhere.com", password: "password" } }
        }.not_to change { User.count }

        expect(response.status).to eq 400

        body = JSON.parse response.body
        expect(body["message"]).to eq "user was not created"
        expect(body["errors"]).to include "Password confirmation can't be blank"
      end
    end
  end
end
