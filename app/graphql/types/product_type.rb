# frozen_string_literal: true

module Types
  class ProductType < Types::BaseObject
    field :id, ID, null: false
    field :stripe_product_id, String, null: false
    field :stripe_price_unit_amount, Integer, null: false
    field :stripe_description, String, null: false
    field :stripe_images, [ String ], null: false
    field :stripe_name, String, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :stripe_default_price_id, String, null: false
  end
end
