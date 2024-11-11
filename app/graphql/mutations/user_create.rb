# frozen_string_literal: true

module Mutations
  class UserCreate < BaseMutation
    description "Creates a new user"

    field :user, Types::UserType, null: true
    field :errors, [ Types::ErrorType ], null: false

    argument :user_input, Types::UserInputType, required: true

    def resolve(user_input:)
      user = ::User.new(
        email: user_input.email,
        password: user_input.password,
        password_confirmation: user_input.password_confirmation
      )

      if user.save
        context[:controller].login(user)

        stripe_customer = ::Stripe::Customer.create({
          # address will not be stored in app database, it's only being used to setup the Stripe Customer
          email: user_input.email,
          address: { **user_input.address },
          name: user_input.name,
          phone: user_input.phone
        })

        if !user.update(stripe_customer_id: stripe_customer.id)
          return {
            user: user, 
            errors: [
              { 
                path: ["attributes", user.errors.first.attribute.to_s.camelize(:lower)], 
                message: user.errors.full_messages.first
              }
            ]
          }
        end

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
