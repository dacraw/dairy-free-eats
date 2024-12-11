class CreateProducts < ActiveRecord::Migration[8.0]
  def change
    create_table :products do |t|
      t.string :stripe_product_id, null: false
      t.integer :stripe_price_unit_amount, null: false
      t.string :stripe_description, null: false
      t.string :stripe_images, array: true, default: []
      t.string :stripe_name, null: false

      t.timestamps
    end

    add_index :products, :stripe_product_id, unique: true
    add_index :products, :stripe_name, unique: true
  end
end
