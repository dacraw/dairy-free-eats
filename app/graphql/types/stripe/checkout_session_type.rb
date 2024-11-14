class Types::Stripe::CheckoutSessionType < Types::BaseObject
    description "Based on https://docs.stripe.com/api/checkout/sessions/object"

    field :id, String, null: false
    field :stripe_object, String, null: false
    def stripe_object
        object.object
    end
    field :amount_subtotal, Integer, null: true
    field :amount_total, Integer, null: true
    field :automatic_tax, Types::Stripe::CheckoutSession::AutomaticTaxType, null: false
    field :billing_address_collection, String, null: true
    field :cancel_url, String, null: true
    field :client_reference_id, String, null: true
    field :created, GraphQL::Types::ISO8601DateTime, null: false
    field :currency, String, null: true
    field :customer, String, null: true
    field :customer_details, Types::Stripe::CheckoutSession::CustomerDetailsType, null: true
    field :customer_email, String, null: true
    field :livemode, Boolean, null: false
    field :line_items, Types::Stripe::LineItemListObjectType, null: false
    def line_items
        Stripe::Checkout::Session.list_line_items object.id
    end
    field :locale, String, null: true
    field :metadata, GraphQL::Types::JSON, null: true
    field :mode, String, null: false
    field :payment_intent, String, null: true
    field :payment_method_collection, String, null: true
    field :payment_method_types, [ String ], null: false
    field :payment_status, String, null: false
    field :success_url, String, null: false
    field :total_details, Types::Stripe::CheckoutSession::TotalDetailsType, null: false
    field :url, String, null: false
end
