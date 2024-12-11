class Resolvers::Stripe::CheckoutSessionResolver < Resolvers::BaseResolver
    type Types::Stripe::CheckoutSessionType, null: false

    argument :id, ID

    def resolve(id:)
        begin
            Stripe::Checkout::Session.retrieve id
        rescue
            raise GraphQL::ExecutionError, "Can't continue with this query"
        end
    end
end
