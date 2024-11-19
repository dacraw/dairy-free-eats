class OrdersChannel < ApplicationCable::Channel
  def subscribed
    @order ||= Order.find_by(id: params[:id])
    @sent_message_ids = []

    if @order.nil?
      puts "Order ##{@order.id} does not exist"
      return
    end

    stream_for @order
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
