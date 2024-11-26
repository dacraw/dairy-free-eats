module Subscriptions
    class CurrentUserNotificationReceived < Subscriptions::BaseSubscription
        subscription_scope :current_user

        field :notification, Types::NotificationType, null: true

        def subscribed(current_user:)
            super

            :no_response
        end
    end
end
