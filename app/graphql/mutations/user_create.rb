# frozen_string_literal: true

module Mutations
  class UserCreate < BaseMutation
    description "Creates a new user"

    field :user, Types::UserType, null: true
    field :errors, [ Types::ErrorType ], null: false

    argument :user_input, Types::UserInputType, required: true

    def resolve(user_input:)
      user = ::User.new(**user_input)

      if user.save
        { user: user, errors: [] }
      else
        errors = user.errors.map do |error|
          path = [ "attributes", error.attribute.to_s.camelize(:lower) ]
          {
            path: path,
            message: error.message
          }
        end
        { errors: errors }
      end
    end
  end
end
