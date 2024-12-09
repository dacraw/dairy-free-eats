class Resolvers::CurrentUserOrdersResolver < Resolvers::BaseResolver
    type [ Types::OrderType ], null: true

    argument :incomplete, Boolean, required: false

    def resolve(incomplete: false)
        current_user = context[:current_user]

        raise GraphQL::ExecutionError, "A current user is not logged in." if !current_user.present?

        if incomplete
            Order
                .where(user_id: current_user.id)
                .where.not(status: :completed)
                .includes(:user)
                .order(created_at: :desc)
        else
            Order
                .where(user_id: current_user.id)
                .includes(:user)
                .order(created_at: :desc)
        end
    end
end
