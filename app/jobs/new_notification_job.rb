class NewNotificationJob < ApplicationJob
  queue_as :default

  def perform(notification)
    NotificationsChannel.broadcast_to(
      notification.user,
      message: notification.message,
      path: notification.path
    )
  end
end
