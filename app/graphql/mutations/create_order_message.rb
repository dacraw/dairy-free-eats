# frozen_string_literal: true

module Mutations
  class CreateOrderMessage < BaseMutation
    field :order_message, Types::OrderMessageType, null: true
    field :errors, Types::ErrorType, null: false

    argument :create_order_message_input_type, Types::OrderMessageInputType, required: true

    def resolve(create_order_message_input_type:)
      order_message = ::OrderMessage.new **create_order_message_input_type

      if order_message.save
        return { order_message: order_message, errors: [] }
      end
      
    end
  end
end
