# frozen_string_literal: true

class Types::Stripe::CustomerAddressType < Types::BaseObject
    field :city, String, null: true
    field :country, String, null: true
    field :line1, String, null: true
    field :line2, String, null: true
    field :postal_code, String, null: true
    field :state, String, null: true
end
