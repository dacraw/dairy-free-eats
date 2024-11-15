# frozen_string_literal: true

module Mutations
  class SetOrderActive < BaseMutation
    field :order, Types::OrderType, null: false

    argument :id, ID, required: true

    def resolve(id:)
      raise GraphQL::ExecutionError, "Only admins can perform this action." if !context[:current_user].admin?

      order = Order.find_by_id(id)

      raise GraphQL::ExecutionError, "The order does not exist." if order.nil?

      raise GraphQL::ExecutionError, "The order is not in the received status." if !order.received?

      order.active!

      order.reload

      { order: order, errors: [] }
    end
  end
end
