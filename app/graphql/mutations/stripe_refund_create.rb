# frozen_string_literal: true

module Mutations
  class StripeRefundCreate < BaseMutation
    field :stripe_refund, Types::Stripe::RefundType, null: true

    argument :payment_intent_id, String, required: true

    def resolve(payment_intent_id:)
      current_user = context[:current_user]

      raise GraphQL::ExecutionError, "User must be authenticated to perform this action." if current_user.nil?
      raise GraphQL::ExecutionError, "User is not authorized to perform this action." if !current_user.admin?

      begin
        stripe_refund = Stripe::Refund.create payment_intent: payment_intent_id, expand: [ "payment_intent" ]
      rescue Stripe::InvalidRequestError => e
        raise GraphQL::ExecutionError, "There was an error processing the refund: #{e.message}"
      end

      { stripe_refund: stripe_refund, errors: [] }
    end
  end
end
