class NewOrderMessageJob < ApplicationJob
  queue_as :default

  def perform(order_message)
    OrdersChannel.broadcast_to(
      order_message.order,
      userId: order_message.user_id,
      body: order_message.body,
      createdAt: order_message.created_at,
      userIsAdmin: order_message.user.admin
    )
  end
end
