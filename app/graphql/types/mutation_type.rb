# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :session_delete, mutation: Mutations::SessionDelete
    field :session_create, mutation: Mutations::SessionCreate
    field :user_create, mutation: Mutations::UserCreate
  end
end
