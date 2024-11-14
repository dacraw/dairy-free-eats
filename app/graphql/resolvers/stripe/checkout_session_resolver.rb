class Resolvers::Stripe::CheckoutSessionResolver < Resolvers::BaseResolver
    type Types::Stripe::CheckoutSessionType, null: false

    argument :id, ID

    def resolve(id:)
        Stripe::Checkout::Session.retrieve id
    end
end
