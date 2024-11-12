class Order < ApplicationRecord
  belongs_to :user, optional: true

  enum :status, [ :received, :active, :in_transit, :completed ]

  validates_presence_of :stripe_payment_intent_id

  before_create  { |order| order.status = :received }
end
