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

    context "#stripe_customer_id" do
      it "allows a value starting with 'cus_'" do
        stripe_customer_id = "cus_12345"
        user = build(
          :user,
          password: "password",
          password_confirmation: "password",
          stripe_customer_id: stripe_customer_id,
          email: "tester@test.com"
        )

        expect { user.save }.to change { User.count }.from(0).to(1)
        expect(user.stripe_customer_id).to eq stripe_customer_id
      end

      it "disallows a value not starting with 'cus_" do
        user = build(
          :user,
          password: "password",
          password_confirmation: "password",
          stripe_customer_id: "this_is_not_right",
          email: "tester@test.com"
        )

        expect { user.save }.not_to change { User.count }
        expect(user.errors.full_messages).to include "Stripe customer does not represent a properly formatted Stripe Customer id."
      end

      it "does not add an error if the field is blank" do
        user = build(
          :user,
          password: "password",
          password_confirmation: "password",
          email: "tester@test.com"
        )

        expect { user.save }.to change { User.count }.from(0).to(1)
        expect(user.errors.full_messages).to be_empty
      end
    end
  end
end
