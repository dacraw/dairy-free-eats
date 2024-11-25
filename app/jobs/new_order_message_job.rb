class NewOrderMessageJob < ApplicationJob
  queue_as :default

  def perform(order_message)
    DairyFreeFoodSchema.subscriptions.trigger(
      :order_message_received,
      { order_id: order_message.order_id },
      order_message,
    )
  end
end
