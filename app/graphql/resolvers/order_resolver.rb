module Resolvers
    class OrderResolver < Resolvers::BaseResolver
        type Types::OrderType, null: true
        argument :id, ID, required: true

        def resolve(id:)
            order = Order.find_by(id: id)

            raise GraphQL::ExecutionError.new "Order #{id} not found" if order.nil?

            order
        end
    end
end
