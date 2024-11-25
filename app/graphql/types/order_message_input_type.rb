# frozen_string_literal: true

module Types
  class OrderMessageInputType < Types::BaseInputObject
    argument :order_id, ID, required: true
    argument :user_id, ID, required: true
    argument :body, String, required: true
  end
end
