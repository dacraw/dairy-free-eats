class Types::Stripe::LineItemType < Types::BaseObject
    field :id, String, null: false
    field :stripeObject, String, null: false
    def stripe_object
        object.object
    end
    field :amount_total, Integer, null: false
    field :description, String, null: false
    field :quantity, Integer, null: false
end
