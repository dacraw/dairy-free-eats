# frozen_string_literal: true

class Types::Stripe::CheckoutSession::TotalDetailsType < Types::BaseObject
  field :amount_discount, Integer, null: false
  field :amount_shipping, Integer, null: false
  field :amount_tax, Integer, null: false
end
