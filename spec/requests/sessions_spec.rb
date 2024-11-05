require 'rails_helper'

RSpec.describe "Sessions", type: :request do
  describe "POST /create" do
    it "creates a new session for a user" do
      user = create :user, :valid_user

      post session_url, params: { session: { email: user.email, password: user.password } }

      logged_in_user = User.last
      expect(logged_in_user.email).to eq user.email
      expect(session[:session_token]).to eq logged_in_user.session_token
      expect(controller.logged_in?).to eq true
      expect(controller.current_user).to eq logged_in_user
    end
  end

  describe "DELETE /destroy" do
    it "logs out a user" do
      user = create :user, :valid_user

      post session_url, params: { session: { email: user.email, password: user.password } }

      logged_in_user = User.last
      expect(session[:session_token]).to eq logged_in_user.session_token

      delete session_url

      logged_out_user = User.last
      expect(logged_in_user.session_token).to eq logged_out_user.session_token
      expect(session[:session_token]).to be nil
    end
  end
end
