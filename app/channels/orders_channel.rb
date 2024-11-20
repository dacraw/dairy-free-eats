class OrdersChannel < ApplicationCable::Channel
  def subscribed
    @order ||= Order.find_by(id: params[:id])
    @sent_message_ids = []

    reject if @order.nil?

    stream_for @order
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
