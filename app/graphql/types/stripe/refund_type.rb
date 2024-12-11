# frozen_string_literal: true

module Types
  class Stripe::RefundType < Types::BaseObject
    field :id, String, null: false
    field :amount, Integer, null: false
    field :payment_intent, Types::Stripe::PaymentIntentType, null: false
  end
end
