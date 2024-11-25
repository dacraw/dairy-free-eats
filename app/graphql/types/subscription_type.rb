# frozen_string_literal: true

module Types
  class SubscriptionType < Types::BaseObject
    field :current_user_notification_received, subscription: Subscriptions::CurrentUserNotificationReceived, null: true
    field :order_message_received, subscription: Subscriptions::OrderMessageReceived, null: true
  end
end
