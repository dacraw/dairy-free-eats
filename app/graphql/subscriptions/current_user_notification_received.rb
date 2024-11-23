module Subscriptions
    class CurrentUserNotificationReceived < Subscriptions::BaseSubscription
        subscription_scope :current_user

        field :notification, Types::NotificationType, null: true

        def subscribe
        end
    end
end
