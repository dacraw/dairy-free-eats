class OrderMessage < ApplicationRecord
  belongs_to :order
  belongs_to :user

  after_create_commit { 
    NewOrderMessageJob.perform_later self
    Notification.create user: order.user, message: "#{user.email_address} has just messaged you"
  }
end
