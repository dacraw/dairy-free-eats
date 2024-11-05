require 'rails_helper'

RSpec.describe User, type: :model do
  context "callbacks" do
    context "when initialized" do
      it "ensures there is a password recovery digest" do
        user = build :user

        expect(user.recovery_password_digest).to be_present
      end

      it "ensures there is a session token" do
        user = build :user

        expect(user.session_token).to be_present
      end
    end
  end

  context "validations" do
    it "requires a password" do
      user = build :user, email: "test@demo.com", password_confirmation: "password"

      expect(user.save).to eq false
      expect(user.errors.full_messages).to include "Password can't be blank"
    end

    it "requires password to be at least 8 characters long" do
      user = build :user, email: "test@demo.com", password: "short", password_confirmation: "short"

      expect(user.save).to eq false
      expect(user.errors.full_messages).to include "Password is too short (minimum is 8 characters)"
    end

    it "requires a password confirmation" do
      user = build :user, email: "test@demo.com", password: "password"

      expect(user.save).to eq false
      expect(user.errors.full_messages).to include "Password confirmation can't be blank"
    end

    it "requires an email" do
      user = build :user, password: "password", password_confirmation: "password"

      expect(user.save).to eq false
      expect(user.errors.full_messages).to include "Email can't be blank"
    end
  end
end
