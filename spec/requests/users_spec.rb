require 'rails_helper'

RSpec.describe "Users", type: :request do
  describe "POST /create" do
    it "creates a user with valid params" do
      expect {
        post users_url,
          params: { user: { email: "test@somewhere.com", password: "password", password_confirmation: "password" } }
      }.to change { User.count }.from(0).to(1)
    end

    context "when there is an issue with the password" do
      it "expects password to be present" do
        expect {
          post users_url, params: { user: { email: "test@somewhere.com", password_confirmation: "password" } }
        }.not_to change { User.count }

        expect(response.status).to eq 400

        body = JSON.parse response.body
        expect(body["message"]).to eq "user was not created"
        expect(body["errors"]).to include "Password can't be blank"
      end

      it "expects password to be at least 8 characters long" do
        expect {
          post users_url, params: { user: { email: "test@somewhere.com", password: "short", password_confirmation: "short" } }
        }.not_to change { User.count }

        expect(response.status).to eq 400

        body = JSON.parse response.body
        expect(body["message"]).to eq "user was not created"
        expect(body["errors"]).to include "Password is too short (minimum is 8 characters)"
      end

      it "expects password confirmation to be present" do
        expect {
          post users_url, params: { user: { email: "test@somewhere.com", password: "password" } }
        }.not_to change { User.count }

        expect(response.status).to eq 400

        body = JSON.parse response.body
        expect(body["message"]).to eq "user was not created"
        expect(body["errors"]).to include "Password confirmation can't be blank"
      end
    end
  end
end
