# frozen_string_literal: true

module Types
  class Stripe::PaymentIntentType < Types::BaseObject
    field :id, String, null: false
    field :amount_received, Integer, null: false
  end
end
