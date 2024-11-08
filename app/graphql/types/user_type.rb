# frozen_string_literal: true

class Types::UserType < Types::BaseObject
    field :id, ID, null: false
    field :email, String, null: false
    field :stripe_customer_id, String
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false 
end
