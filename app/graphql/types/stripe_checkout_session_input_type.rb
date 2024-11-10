# frozen_string_literal: true

module Types
  class StripeCheckoutSessionInputType < Types::BaseInputObject
    argument :line_items, [ Types::OrderPageInputType ], required: true
  end
end
