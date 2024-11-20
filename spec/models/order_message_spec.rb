require 'rails_helper'

RSpec.describe OrderMessage, type: :model do
  context "when creating" do
    before(:each) { ActiveJob::Base.queue_adapter.enqueued_jobs.clear }

    it "creates with valid params" do
      order = create :order, :with_line_items, :with_a_user

      order_attributes = {
        order: order,
        user: order.user,
        body: "heyo"
      }

      order_message = build :order_message, **order_attributes

      expect {
        order_message.save
      }.to change { OrderMessage.count }.from(0).to(1)

      expect(OrderMessage.last.order).to eq order_attributes[:order]
      expect(OrderMessage.last.user).to eq order_attributes[:user]
      expect(OrderMessage.last.body).to eq order_attributes[:body]
    end

    it "requires a user" do
      order = create :order, :with_line_items

      order_message = build :order_message, order: order, body: "heyo"

      expect {
        order_message.save
      }.not_to change { OrderMessage.count }

      expect(order_message.errors.full_messages).to include "User must exist"
    end

    it "requires an order" do
      user = create :user, :valid_user

      order_message = build :order_message, user: user, body: "heyo"

      expect {
        order_message.save
      }.not_to change { OrderMessage.count }

      expect(order_message.errors.full_messages).to include "Order must exist"
    end

    it "enqueues a new order message job" do
      create :order_message, :valid_order_message, body: "heyo"

      expect(NewOrderMessageJob).to have_been_enqueued.exactly(:once)
    end
  end
end
