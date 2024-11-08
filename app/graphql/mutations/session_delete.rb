# frozen_string_literal: true

module Mutations
  class SessionDelete < BaseMutation
    description "Logs the current user out"

    field :user, Types::UserType, null: true
    field :errors, [ Types::ErrorType ], null: false

    def resolve
      if !context[:current_user]
        return { user: nil, errors: [ message: "There is no current user" ] }
      end
      context[:controller].logout!

      { user: nil, errors: [] }
    end
  end
end
