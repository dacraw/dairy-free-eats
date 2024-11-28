# frozen_string_literal: true

class Types::Stripe::ProductType < Types::BaseObject
    field :id, String, null: false
    field :stripe_object, String, null: false
    def stripe_object
        object.object
    end

    field :active, Boolean, null: false
    field :attributes, [ String, null: true ], null: false
    field :created, GraphQL::Types::ISO8601DateTime, null: false
    field :default_price, Types::Stripe::PriceType, null: false
    field :description, String, null: false
    field :images, [ String, null: true ], null: false
    field :livemode, Boolean, null: false
    field :marketing_features, GraphQL::Types::JSON, null: false
    field :metadata, GraphQL::Types::JSON, null: false
    field :name, String, null: false
    field :package_dimensions, GraphQL::Types::JSON, null: true
    field :shippable, Boolean, null: true
    field :statement_descriptor, String, null: true
    field :tax_code, String, null: false
    field :type, String, null: false
    field :unit_label, String, null: true
    field :updated, GraphQL::Types::ISO8601DateTime, null: false
    field :url, String, null: true
end
