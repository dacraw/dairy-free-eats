class Resolvers::CurrentUserOrdersResolver < Resolvers::BaseResolver
    type [ Types::OrderType ], null: true

    def resolve
        return nil if !context[:current_user].present?
        
        Order.where(user_id: context[:current_user].id).order(created_at: :desc)
    end
end
