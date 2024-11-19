class NewOrderMessageJob < ApplicationJob
  queue_as :default

  def perform(order_message)
    # Do something later
    OrdersChannel.broadcast_to(
      order_message.order, 
      body: order_message.body, 
      createdAt: order_message.created_at
    )
  end
end
