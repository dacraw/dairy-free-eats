# frozen_string_literal: true

module Types
  class ErrorType < Types::BaseObject
    description "Generic error type"
    
    field :message, String, null: false
    field :path, [String]
  end
end
