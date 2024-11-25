class Subscriptions::OrderMessageReceived < Subscriptions::BaseSubscription
    argument :order_id, ID, required: true
    # argument :order_id, ID, loads: Types::OrderType

    # field :order_message, Types::OrderMessageType, null: true
    payload_type Types::OrderMessageType


    def subscribe(order_id:)
        super

        :no_response
    end

    def update(order_id:)
        if object.user == context[:current_user]
            NO_UPDATE
        else
            super
        end
    end
end
