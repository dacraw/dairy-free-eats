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
      # ::Stripe::Product.list active: true, expand: ['data.default_price']

      ::Stripe::ListObject.construct_from({
      "object": "list",
      "data": [
        {"id":"prod_R8KkVOibvpRPlc","object":"product","active":true,"attributes":[],"created":1730403020,"default_price":{"id":"price_1QG44XElA4InVgv8dOnqfhyu","object":"price","active":true,"billing_scheme":"per_unit","created":1730403021,"currency":"usd","custom_unit_amount":nil,"livemode":false,"lookup_key":nil,"metadata":{},"nickname":nil,"product":"prod_R8KkVOibvpRPlc","recurring":nil,"tax_behavior":"unspecified","tiers_mode":nil,"transform_quantity":nil,"type":"one_time","unit_amount":300,"unit_amount_decimal":"300"},"description":"Blended mixed berries, filtered water","images":["https://files.stripe.com/links/MDB8YWNjdF8xUUczb3lFbEE0SW5WZ3Y4fGZsX3Rlc3RfUGczWDd3YkUzR1JBY2tOck14NEVnYXpp00CBDSqGR6"],"livemode":false,"marketing_features":[],"metadata":{},"name":"Mixed Berry Smoothie (Water base)","package_dimensions":nil,"shippable":nil,"statement_descriptor":nil,"tax_code":"txcd_20030000","type":"service","unit_label":nil,"updated":1732761774,"url":nil},
        {"id":"prod_R8KiBa0tljS7SV","object":"product","active":true,"attributes":[],"created":1730402927,"default_price":{"id":"price_1QG432ElA4InVgv8Zy7PaGPY","object":"price","active":true,"billing_scheme":"per_unit","created":1730402928,"currency":"usd","custom_unit_amount":nil,"livemode":false,"lookup_key":nil,"metadata":{},"nickname":nil,"product":"prod_R8KiBa0tljS7SV","recurring":nil,"tax_behavior":"unspecified","tiers_mode":nil,"transform_quantity":nil,"type":"one_time","unit_amount":300,"unit_amount_decimal":"300"},"description":"2 salted/peppered eggs, 2 strips of bacon, hummis","images":["https://files.stripe.com/links/MDB8YWNjdF8xUUczb3lFbEE0SW5WZ3Y4fGZsX3Rlc3RfbUNoWnRHazJyN3JGVDNMZTZjM1dua0xh008k0zo7yY"],"livemode":false,"marketing_features":[],"metadata":{},"name":"Breakfast Burrito","package_dimensions":nil,"shippable":nil,"statement_descriptor":nil,"tax_code":"txcd_20030000","type":"service","unit_label":nil,"updated":1732756272,"url":nil}
      ],
      "has_more": false,
      "url": "/v1/products"
    })
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

      order.order_messages.order(created_at: :asc)
    end

    field :current_user_notifications, Types::NotificationType.connection_type, null: false
    def current_user_notifications
      results = context[:current_user].notifications.order(created_at: :desc)

      Connections::CurrentUserNotificationsConnection.new(results)
    end
  end
end
