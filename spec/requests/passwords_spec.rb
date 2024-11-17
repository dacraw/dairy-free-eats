require 'rails_helper'

RSpec.describe "Passwords", type: :request do
  describe "POST /passwords" do
    context "when the user exists" do
      let(:user) { create :user, :valid_user }
      let(:passwords_mailer_double) { double PasswordsMailer }

      it "sends an email to the user" do
        expect(PasswordsMailer).to receive(:reset).with(user) { passwords_mailer_double }
        expect(passwords_mailer_double).to receive(:deliver_later) { true }
        
        post passwords_path, params: { password: { email_address: user.email_address}}
        
        expect(response).to have_http_status(200)

        expect(JSON.parse(response.body)["message"]).to eq "Password reset instructions sent (if user with that email address exists)."
      end
    end
  end

  describe "PATCH /password" do
    context "when the user has a valid password reset token" do
      let(:user) { create :user, :valid_user }

      context "when the password and password confirmation matches" do
        it "updates the user's password" do
          new_password = Faker::Internet.password min_length: 8

          expect {
            patch password_path(token: user.password_reset_token), params: { 
              password: new_password,
              password_confirmation: new_password
            }
          }.to change { user.reload.password_digest }

          response_body = JSON.parse(response.body)
          expect(response_body["message"]).to eq "success"
          expect(response_body["redirect_url"]).to eq "/login"
        end
      end

      context "when there is an unmatching password and password confirmation" do
        it "returns a json error" do
          expect {
            patch password_path(token: user.password_reset_token), params: { 
              password: "new_password",
              password_confirmation: "does_not_match"
            }
          }.not_to change { user.reload.password_digest }

          response_body = JSON.parse(response.body)
          expect(response_body["message"]).to eq "failed"
          expect(response_body["error"]).to eq "Passwords did not match."
        end
      end
    end
  end
end
