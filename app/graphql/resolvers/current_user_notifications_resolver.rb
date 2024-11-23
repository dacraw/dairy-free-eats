module Resolvers
    class CurrentUserNotificationsResolver < Resolvers::BaseResolver
        type [ Types::NotificationType ], null: true


        def resolve
            notifications = context[:current_user].notifications.order(created_at: :desc)

            return nil if notifications.empty?

            notifications
        end
    end
end
