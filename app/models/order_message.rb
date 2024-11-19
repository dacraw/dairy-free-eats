class OrderMessage < ApplicationRecord
  belongs_to :order
  belongs_to :user

  after_commit { NewOrderMessageJob.perform_later self }
end
