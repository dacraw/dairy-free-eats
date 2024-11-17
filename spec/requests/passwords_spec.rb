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
end
