# frozen_string_literal: true

require "nano-bots"

module Mutations
  class GenerateGeminiOrderMessage < BaseMutation
    field :order_message, Types::OrderMessageType, null: true
    field :errors, [ Types::ErrorType ], null: false

    argument :order_message_id, ID, "The order message ID that Gemini will be responding to", required: true

    def resolve(order_message_id:)
      order_message_responding_to = OrderMessage.find_by_id order_message_id

      raise GraphQL::ExecutionError, "The order message cannot be found that Gemini should respond to" if order_message_responding_to.nil?

      order = Order.find_by_id order_message_responding_to.order

      begin
        bot = NanoBot.new(cartridge: CARTRIDGE_CONFIG)

        prompt = <<-PROMPT
          You are going to answer a user's question about their order. You should not answer any question that is not about their order. If they ask a question that has nothing to do with their order, you must reply with "I'm sorry, but I can only answer questions about your order."

          If they ask whether the food tastes good, you will assure them that it does.

          If they complain that the food is too expensive, you will tell them that the food is home cooked and competitively priced compared to alternatives.

          Provide a response to a user's question about their order. Here is the user's question:

          User question: %{order_message_body}

          Order information:
            - Order items: %{order_items}
            - Order total: $%{order_total}
            - Order status: %{order_status}
        PROMPT

        formatted_prompt = format(
          prompt,
          order_message_body: OrderMessage.find_by_id(order_message_id).body,
          order_items: Order.find_by_id(OrderMessage.find_by_id(order_message_id).order).stripe_checkout_session_line_items,
          order_total: Order.find_by_id(OrderMessage.find_by_id(order_message_id).order).amount_total,
          order_status: Order.find_by_id(OrderMessage.find_by_id(order_message_id).order).status
        )

        gemini_response = bot.eval formatted_prompt

      rescue StandardError => e
        raise GraphQL::ExecutionError, "There was an issue creating a response. Please try again in a minute."
      end

      order_message = OrderMessage.new(
        order: order,
        user: User.find_by_email_address(User::GEMINI_USER_EMAIL),
        body: gemini_response
      )

      if order_message.save
        { order_message: order_message, errors: [] }
      else
        {
          order_message: nil,
          errors: order_message.errors.map do |error|
            {
              message: error.message,
              path: [ error.attribute.to_s.titleize ]
            }
          end
        }
      end
    end
  end
end
