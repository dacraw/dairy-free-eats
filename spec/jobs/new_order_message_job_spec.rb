require 'rails_helper'

RSpec.describe NewOrderMessageJob, type: :job do
  let(:order) { create :order, :with_line_items, :with_a_user, :with_order_messages }

  it "broadcasts an order to the Graphql subscriptions" do
    order_message = order.order_messages.first
    subs_double = double GraphQL::Subscriptions::ActionCableSubscriptions

    expect(DairyFreeFoodSchema).to receive(:subscriptions) { subs_double }
    expect(subs_double).to receive(:trigger).with(
      :order_message_received,
      { order_id: order_message.order_id },
      order_message,
    )

    NewOrderMessageJob.perform_now order_message
  end
end
