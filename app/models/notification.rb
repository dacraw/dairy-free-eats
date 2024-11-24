class Notification < ApplicationRecord
    belongs_to :user

    validates_presence_of :message

    after_create_commit {
        NewNotificationJob.perform_later self
    }
end
