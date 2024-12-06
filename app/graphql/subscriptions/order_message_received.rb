class Subscriptions::OrderMessageReceived < Subscriptions::BaseSubscription
    argument :order_id, ID, required: true

    payload_type Types::OrderMessageType

    def subscribe(order_id:)
        super
    end

    def update(order_id:)
        if object.user == context[:current_user]
            NO_UPDATE
        else
            super
        end
    end
end
