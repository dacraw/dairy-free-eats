# frozen_string_literal: true

require "aws-sdk-s3"

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

    field :current_user, Types::UserType, null: true
    def current_user
      context[:current_user]
    end

    field :products, [ Types::ProductType ], null: false
    def products
      Product.all
    end

    field :fetch_checkout_session, resolver: Resolvers::Stripe::CheckoutSessionResolver, null: true

    field :orders, resolver: Resolvers::OrdersResolver, null: true

    field :current_user_orders, resolver: Resolvers::CurrentUserOrdersResolver

    field :order, resolver: Resolvers::OrderResolver, null: true

    field :order_messages, [ Types::OrderMessageType ], null: false do
      argument :order_id, ID, required: true
    end

    def order_messages(order_id:)
      order = ::Order.find_by(id: order_id)

      raise GraphQL::ExecutionError.new "Order not found for order id##{order_id}" if order.nil?

      order.order_messages.includes(:user).order(created_at: :asc)
    end

    field :current_user_notifications, Types::NotificationType.connection_type, null: false
    def current_user_notifications
      results = context[:current_user].notifications.order(created_at: :desc)

      Connections::CurrentUserNotificationsConnection.new(results)
    end

    field :demo_video_presigned_url, String, null: false
    def demo_video_presigned_url
      s3 = Aws::S3::Client.new(
        region: "us-east-1",
        access_key_id: Rails.application.credentials.dig(:aws, :access_key_id),
        secret_access_key: Rails.application.credentials.dig(:aws, :secret_access_key)
      )
      s3_presigner = Aws::S3::Presigner.new(client: s3)
      s3_presigner.presigned_url(
        :get_object,
        bucket: Rails.env.production? ? "dairy-free-eats-production" : "dairy-free-eats-development",
        key: "dairy-free-eats-demo.mp4"
      )
    end
  end
end
