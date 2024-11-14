class Resolvers::OrdersResolver < Resolvers::BaseResolver
    type [Types::OrderType], null: false

    def resolve
        Order.all
    end
end
