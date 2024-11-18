# frozen_string_literal: true

module Types
  class OrderType < Types::BaseObject
    field :id, ID, null: false
    field :user, Types::UserType

    field :status, Types::OrderStatus, null: false
    def status
      # Return the string value instead of the integer enum
      object.status
    end

    field :stripe_payment_intent_id, String, null: false

    field :created_at, String, null: false
    def created_at
      object.created_at.strftime "%Y-%m-%d"
    end

    field :updated_at, String, null: false
    def updated_at
      object.updated_at.strftime "%Y-%m-%d"
    end

    field :stripe_checkout_session_line_items, [ Types::OrderLineItemType ], null: false
    field :guest_email, String, null: true
    def guest_email
      return nil if object.guest_email.nil?

      if context[:current_user].present? && context[:current_user].demo_admin?
        "redacted email (as demo admin)"
      else
        object.guest_email
      end
    end
  end
end
