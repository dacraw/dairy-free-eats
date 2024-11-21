require 'rails_helper'

RSpec.describe Notification, type: :model do
  before(:each) { ActiveJob::Base.queue_adapter.enqueued_jobs.clear }
  
  it "is creates a notification" do
    notification = build :notification, user: create(:user, :valid_user), message: "hey", path: "/order"

    expect { notification.save }.to change {Notification.count}.from(0).to(1)
  end

  it "requires a message" do
    notification = build :notification, user: create(:user, :valid_user)

    expect { notification.save }.not_to change { Notification.count }

    expect(notification.errors.full_messages).to include "Message can't be blank"
  end

  it "requires a user" do
    notification = build :notification, message: "heyo"

    expect { notification.save }.not_to change { Notification.count }
    
    expect(notification.errors.full_messages).to include "User must exist"
  end

  it "queues a job" do
    create :notification, user: create(:user, :valid_user), message: "yoyo"

    expect(NewNotificationJob).to have_been_enqueued.exactly(:once)
  end
end
