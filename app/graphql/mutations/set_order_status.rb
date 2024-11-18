# frozen_string_literal: true

module Mutations
  class SetOrderStatus < BaseMutation
    field :order, Types::OrderType, null: false

    argument :set_order_status_input_type, Types::OrderStatusInputType, required: true

    def resolve(set_order_status_input_type:)
      raise GraphQL::ExecutionError, "Only admins can perform this action." if !context[:current_user].admin?

      order = Order.find_by_id(set_order_status_input_type[:id])

      raise GraphQL::ExecutionError, "The order does not exist." if order.nil?

      order.update(status: set_order_status_input_type[:status])

      case order.status.to_sym
      when :active
        OrderMailer.with(order: order).order_active.deliver_later
      end


      order.reload

      { order: order, errors: [] }
    end
  end
end
