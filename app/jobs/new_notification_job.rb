class NewNotificationJob < ApplicationJob
  queue_as :default

  def perform(notification)
    DairyFreeFoodSchema.subscriptions.trigger(
      :current_user_notification_received,
      {},
      { notification: notification },
      scope: notification.user
    )
  end
end
