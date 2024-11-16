# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :set_order_status, mutation: Mutations::SetOrderStatus
    field :stripe_checkout_session_create, mutation: Mutations::StripeCheckoutSessionCreate
    field :session_delete, mutation: Mutations::SessionDelete
    field :demo_admin_session_create, mutation: Mutations::DemoAdminSessionCreate
    field :user_create, mutation: Mutations::UserCreate
  end
end
