module Types
    class OrderStatus < Types::BaseEnum
        description "Possible order statuses"

        value "received", "Orders are set to received when first created, and are not being processed"
        value "active", "Active status means the order is being prepared"
        value "in_transit", "Order is being delivered to the customer"
        value "completed", "Order has been delivered successfully"
        value "cancelled", "Order is cancelled and cannot be re-activated"
    end
end
