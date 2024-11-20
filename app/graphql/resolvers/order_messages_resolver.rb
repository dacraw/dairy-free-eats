module Resolvers
    class OrderMessagesResolver < Resolvers::BaseResolver
        type [ Types::OrderMessageType ], null: false

        argument :order_id, ID, required: true

        def resolve(order_id:)
            order = ::Order.find_by(id: order_id)

            raise GraphQL::ExecutionError.new "Order not found for order id##{order_id}" if order.nil?

            order.order_messages.order(created_at: :asc)
        end
    end
end
