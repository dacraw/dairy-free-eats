# frozen_string_literal: true

module Mutations
  class StripeCheckoutSessionCreate < BaseMutation
    description "Creates a new stripe_checkout_session"

    field :stripe_checkout_session, Types::Stripe::CheckoutSessionType, null: true
    field :errors, [ Types::ErrorType ], null: false

    argument :stripe_checkout_session_input, Types::StripeCheckoutSessionInputType, required: true

    def resolve(stripe_checkout_session_input:)
      items = stripe_checkout_session_input.line_items

      if items.any? { |item| !item.price.match /^price_.*$/ }
        return {
          stripe_checkout_session: nil,
          errors: [ { message: "One of the entered keys doesn't represent a price id." } ]
        }
      end

      if items.all? { |item| item.quantity == 0 }
        return {
          stripe_checkout_session: nil,
          errors: [ { message: "You must enter a quantity for at least one item." } ]
        }
      end

      stripe_customer = context[:current_user]&.stripe_customer_id&.present? ? Stripe::Customer.retrieve(context[:current_user]&.stripe_customer_id) : nil

      begin
        stripe_checkout_session = Stripe::Checkout::Session.create({
          success_url: "http://localhost:3000/success",
          cancel_url: "http://localhost:3000/order",
          line_items: items.map { |item| item.to_h },
          mode: "payment",
          phone_number_collection: {
              enabled: context[:current_user].present? ? false : true
          },
          customer: (context[:current_user].stripe_customer_id if context[:current_user].present?)
        })

      rescue Stripe::InvalidRequestError => e
          return {
            stripe_checkout_session: nil,
            errors: [ { message: "Unfortunately, there is an issue with the Stripe checkout at this time. Please try again later." } ]
          }
      end

      { stripe_checkout_session: stripe_checkout_session, errors: []  }
    end
  end
end
