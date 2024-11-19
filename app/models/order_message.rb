class OrderMessage < ApplicationRecord
  belongs_to :order
  belongs_to :user

  after_commit { OrdersChannel.broadcast_to self.order, self}
end
