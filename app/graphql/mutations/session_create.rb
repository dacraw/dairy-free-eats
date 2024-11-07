# frozen_string_literal: true

module Mutations
  class SessionCreate < BaseMutation
    description "Creates a new session"

    field :user, Types::UserType, null: false

    argument :session_input, Types::SessionInputType, required: true

    def resolve(session_input:)
      user = User.find_by_email(session_input[:email])
      authenticated_user = user.authenticate(session_input[:password])
      context[:controller].login(authenticated_user) 

      { user: user }
    end
  end
end
