# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    field :node, Types::NodeType, null: true, description: "Fetches an object given its ID." do
      argument :id, ID, required: true, description: "ID of the object."
    end

    def node(id:)
      context.schema.object_from_id(id, context)
    end

    field :nodes, [ Types::NodeType, null: true ], null: true, description: "Fetches a list of objects given a list of IDs." do
      argument :ids, [ ID ], required: true, description: "IDs of the objects."
    end

    def nodes(ids:)
      ids.map { |id| context.schema.object_from_id(id, context) }
    end

    # Add root-level fields here.
    # They will be entry points for queries on your schema.

    field :current_user, Types::UserType, null: true
    def current_user
      context[:current_user]
    end

    field :retrieve_product, Types::Stripe::ProductType, null: true do
      argument :product_id, String, required: true
    end
    def retrieve_product(product_id:)
      ::Stripe::Product.retrieve product_id
    end

    field :list_products, Types::Stripe::ProductListObjectType, null: false
    def list_products
      ::Stripe::Product.list active: true
    end

    field :fetch_checkout_session, resolver: Resolvers::Stripe::CheckoutSessionResolver, null: true

    field :orders, resolver: Resolvers::OrdersResolver, null: true
  end
end
