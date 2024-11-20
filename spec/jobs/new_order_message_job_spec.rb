require 'rails_helper'

RSpec.describe NewOrderMessageJob, type: :job do
  let(:order) { create :order, :with_line_items, :with_a_user, :with_order_messages }

  it "broadcasts an order to OrdersChannel" do
    order_message = order.order_messages.first

    expect(OrdersChannel)
      .to receive(:broadcast_to)
      .with(
        order_message.order,
        userId: order_message.user_id,
        body: order_message.body,
        createdAt: order_message.created_at,
        userIsAdmin: order_message.user.admin
      )

    NewOrderMessageJob.perform_now order_message
  end
end
