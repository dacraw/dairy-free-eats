class Resolvers::OrdersResolver < Resolvers::BaseResolver
    type [ Types::OrderType ], null: false

    def resolve
        Order.all.order(created_at: :desc)
    end
end
