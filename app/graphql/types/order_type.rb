# frozen_string_literal: true

module Types
  class OrderType < Types::BaseObject
    field :id, ID, null: false
    field :user_id, Integer
    field :status, Integer, null: false
    field :stripe_payment_intent_id, String, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :stripe_checkout_session_line_items, GraphQL::Types::JSON
  end
end
