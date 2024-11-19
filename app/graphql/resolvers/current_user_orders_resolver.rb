class Resolvers::CurrentUserOrdersResolver < Resolvers::BaseResolver
    type [ Types::OrderType ], null: true
    
    argument :completed, Boolean, required: true

    def resolve(completed:)
        current_user = context[:current_user]
        
        return nil if !current_user.present?

        if completed
            Order
                .where(user_id: current_user.id)
                .completed
                .order(created_at: :desc)
        else
            Order
                .where(user_id: current_user.id)
                .where.not(status: :completed)
                .order(created_at: :desc)
        end
    end
end
