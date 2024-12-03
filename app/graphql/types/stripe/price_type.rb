# frozen_string_literal: true

module Types
  class Stripe::PriceType < Types::BaseObject
    field :id, String, null: false
    field :stripe_object, String, null: false
    def stripe_object
        object.object
    end
    field :unit_amount, Integer, null: false
  end
end
