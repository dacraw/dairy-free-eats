class AddStripeDefaultPriceIdToProducts < ActiveRecord::Migration[8.0]
  def change
    add_column :products, :stripe_default_price_id, :string, null: false

    add_index :products, :stripe_default_price_id, unique: true
  end
end
