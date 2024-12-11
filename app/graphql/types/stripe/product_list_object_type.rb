class Types::Stripe::ProductListObjectType < Types::BaseObject
    field :stripe_object, String, null: false
    def stripe_object
        object.object
    end

    field :data, [ Types::Stripe::StripeProductType ], null: true
    field :has_more, Boolean, null: false
    field :url, String, null: false
end
