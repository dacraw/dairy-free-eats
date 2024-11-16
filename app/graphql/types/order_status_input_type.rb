# frozen_string_literal: true

module Types
  class OrderStatusInputType < Types::BaseInputObject
    argument :id, ID, required: true
    argument :status, Types::OrderStatus, required: true
  end
end
