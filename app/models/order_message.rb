class OrderMessage < ApplicationRecord
  belongs_to :order
  belongs_to :user

  validates_presence_of :body

  after_create_commit {
    NewOrderMessageJob.perform_later self

    if user == order.user && !user.admin
      # user is the one who placed the order, so the notification should be for admins
      User.where(admin: true).each do |admin_user|
        Notification.create user: admin_user, message: "#{self.user.email_address} has sent a message for order##{self.order_id}: \"#{self.body.truncate 20}\""
      end
    else
      # the message is created by an admin user, so the order user should receive the notification
      Notification.create user: order.user, message: "An order admin has just messaged you about Order ##{self.order_id}: \"#{self.body.truncate 20}\""
    end
  }
end
