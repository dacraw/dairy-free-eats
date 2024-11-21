require 'rails_helper'

RSpec.describe NewNotificationJob, type: :job do
  it "broadcasts" do
    notification = create :notification, user: create(:user, :valid_user), message: "heyo"

    expect(NotificationsChannel)
      .to receive(:broadcast_to)
      .with(
        notification.user,
        message: notification.message,
        path: notification.path
      )

    NewNotificationJob.perform_now notification
  end
end
