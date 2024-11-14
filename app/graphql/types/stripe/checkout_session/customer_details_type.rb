# frozen_string_literal: true

class Types::Stripe::CheckoutSession::CustomerDetailsType < Types::BaseObject
  field :address, Types::Stripe::CustomerAddressType, null: true
  field :email, String, null: true
  field :name, String, null: true
  field :phone, String, null: true
  field :tax_exempt, String, null: true
  field :tax_ids, [ GraphQL::Types::JSON ], null: true
end
