class Resolvers::Stripe::CheckoutSessionResolver < Resolvers::BaseResolver
    type Types::Stripe::CheckoutSessionType, null: false

    argument :id, ID

    def resolve(id:)
        begin
            Stripe::Checkout::Session.retrieve id
        rescue
            puts "ERROR: There was an issue retrieving stripe checkout id ##{id}"
            raise GraphQL::ExecutionError, "Can't continue with this query"
        end
    end
end
