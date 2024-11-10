# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :stripe_checkout_session_create, mutation: Mutations::StripeCheckoutSessionCreate
    field :session_delete, mutation: Mutations::SessionDelete
    field :session_create, mutation: Mutations::SessionCreate
    field :user_create, mutation: Mutations::UserCreate
  end
end
