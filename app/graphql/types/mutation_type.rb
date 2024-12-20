# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :generate_gemini_order_message, mutation: Mutations::GenerateGeminiOrderMessage
    field :create_order_message, mutation: Mutations::CreateOrderMessage
    field :set_order_status, mutation: Mutations::SetOrderStatus
    field :stripe_checkout_session_create, mutation: Mutations::StripeCheckoutSessionCreate
    field :demo_admin_session_create, mutation: Mutations::DemoAdminSessionCreate
  end
end
