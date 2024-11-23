require 'rails_helper'

RSpec.describe NewNotificationJob, type: :job do
  it "broadcasts" do
    notification = create :notification, user: create(:user, :valid_user), message: "heyo"
    subs_double = double GraphQL::Subscriptions::ActionCableSubscriptions

    expect(DairyFreeFoodSchema).to receive(:subscriptions) { subs_double }
    expect(subs_double).to receive(:trigger).with(
      :current_user_notification_received,
      {},
      { notification: notification },
      scope: notification.user
    )

    NewNotificationJob.perform_now notification
  end
end
