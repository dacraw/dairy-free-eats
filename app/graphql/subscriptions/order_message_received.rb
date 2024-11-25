class Subscriptions::OrderMessageReceived < Subscriptions::BaseSubscription
    argument :order_id, ID, required: true
    # argument :order_id, ID, loads: Types::OrderType

    # field :order_message, Types::OrderMessageType, null: true
    payload_type Types::OrderMessageType
   

    def subscribe(order_id:)
        super
        context[:channel].stream_for Order.find(order_id)

        :no_response
    end
end