class ChangeColumnStripeIdToStripePaymentIntentId < ActiveRecord::Migration[8.0]
  def change
    rename_column :orders, :stripe_id, :stripe_payment_intent_id
  end
end
