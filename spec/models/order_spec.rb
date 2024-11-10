require 'rails_helper'

RSpec.describe Order, type: :model do
  context "associations" do
    it "sets a user if assigned" do
      user = create :user, :valid_user
      order = build :order, user: user, stripe_id: "12345"

      expect(order.user).to eq user
    end
  end

  context "validations" do
    it "allows an Order to be created without a user" do
      order = build :order, stripe_id: "pi_12345"

      expect { order.save }.to change { Order.count }.from(0).to(1)
    end

    it "requires stripe_id to be present" do
      order = build :order

      expect { order.save }.not_to change { Order.count }

      expect(order.errors.full_messages).to include "Stripe can't be blank"
    end
  end

  context "before the order is created" do
    it "sets the status to received" do
      order = build :order, stripe_id: "pi_12345"

      expect { order.save }.to change { Order.count }.from(0).to(1)

      expect(order.received?).to be true
    end
  end
end
