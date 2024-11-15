# frozen_string_literal: true

module Types
  class UserInputType < Types::BaseInputObject
    argument :id, ID, required: false
    argument :email, String, required: true
    argument :password, String, required: true
    argument :password_confirmation, String, required: true
    argument :stripe_customer_id, String, required: false

    # these values are for creating a Stripe Customer and are not part of the User model
    # Commenting out to make easier to sign up and demo
    # argument :address, Types::Stripe::AddressInputType, required: true
    # argument :name, String, "The full name of the user", required: true
    # argument :phone, String, required: true
  end
end
