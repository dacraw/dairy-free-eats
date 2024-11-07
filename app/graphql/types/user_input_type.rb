# frozen_string_literal: true

module Types
  class UserInputType < Types::BaseInputObject
    argument :id, ID, required: false
    argument :email, String, required: true
    argument :password, String, required: true
    argument :password_confirmation, String, required: true
    argument :stripe_customer_id, String, required: false
  end
end
