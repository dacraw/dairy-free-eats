# frozen_string_literal: true

module Types
  class OrderMessageType < Types::BaseObject
    field :id, ID, null: false
    field :order_id, ID, null: false
    field :user_id, ID, null: false
    field :body, String
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :user_is_admin, Boolean, null: false
    def user_is_admin
      object.user.admin
    end
  end
end
