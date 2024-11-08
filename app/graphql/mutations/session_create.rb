# frozen_string_literal: true

module Mutations
  class SessionCreate < BaseMutation
    description "Creates a new session"

    field :user, Types::UserType, null: true
    field :errors, [ Types::ErrorType ], null: false

    argument :session_input, Types::SessionInputType, required: true

    def resolve(session_input:)
      user = User.find_by_email(session_input[:email])

      invalid_credentials_error = [ { path: [ "attributes", "credentials" ], message: "invalid" } ]

      return { user: user, errors: invalid_credentials_error }  if user.nil?

      authenticated_user = user.authenticate(session_input[:password])

      return { user: nil, errors: invalid_credentials_error } if !authenticated_user

      context[:controller].login(authenticated_user)

      { user: user, errors: [] }
    end
  end
end
