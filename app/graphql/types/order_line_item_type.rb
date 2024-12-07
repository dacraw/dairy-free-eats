# frozen_string_literal: true

module Types
  class OrderLineItemType < Types::BaseObject
    field :name, String, null: false
    field :quantity, Integer, null: false
    field :image_url, String, null: false
    field :unit_amount, Integer, null: false
  end
end
