# frozen_string_literal: true

class Types::Stripe::AddressInputType < Types::BaseInputObject
  argument :city, String, required: true
  argument :country, String, required: true
  argument :line1, String, required: true
  argument :line2, String, required: false
  argument :postal_code, String, required: true
  argument :state, String, required: true
end
