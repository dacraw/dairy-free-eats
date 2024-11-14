class Types::Stripe::LineItemListObjectType < Types::BaseObject
    field :stripe_object, String, null: false
    def stripe_object
        object.object
    end

    field :data, [ Types::Stripe::LineItemType ], null: true
    field :has_more, Boolean, null: false
    field :url, String, null: false
end
