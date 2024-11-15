# frozen_string_literal: true

module Mutations
  class DemoAdminSessionCreate < BaseMutation
    description "Creates a new session"

    field :user, Types::UserType, null: true
    field :errors, [ Types::ErrorType ], null: false

    def resolve
      user = User.find_by_email(User::DEMO_ADMIN_EMAIL)

      authenticated_user = user.authenticate(Rails.application.credentials.dig(:demo_admin_password))

      context[:controller].login(authenticated_user)

      { user: user, errors: [] }
    end
  end
end
