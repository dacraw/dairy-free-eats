# frozen_string_literal: true

class Types::UserType < Types::BaseObject
    field :id, ID, null: false
    field :email, String, null: false
    def email
        if context[:current_user].present? && context[:current_user].demo_admin? && object.email_address != User::DEMO_ADMIN_EMAIL
            "redacted email (as demo admin)"
        else
            object.email_address
        end
    end
    field :stripe_customer_id, String
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :admin, Boolean, null: false
end
