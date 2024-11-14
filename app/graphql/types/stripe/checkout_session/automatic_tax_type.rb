# frozen_string_literal: true

class Types::Stripe::CheckoutSession::AutomaticTaxType < Types::BaseObject
  field :enabled, Boolean, null: false
  field :liability, GraphQL::Types::JSON, null: true
  field :status, String, null: true
end
