class NewOrderMessageJob < ApplicationJob
  queue_as :default

  def perform(order_message)
    # Do something later
    OrdersChannel.broadcast_to order_message.order, order_message
  end
end
