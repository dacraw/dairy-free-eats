class Order < ApplicationRecord
  belongs_to :user, optional: true

  has_many :order_messages, dependent: :destroy

  enum :status, [ :received, :active, :in_transit, :completed, :cancelled ]

  scope :incomplete, -> { where.not(status: :completed) }

  validates_presence_of :stripe_payment_intent_id

  before_create  { |order| order.status = :received }
end
