class CreateOrders < ActiveRecord::Migration[8.0]
  def change
    create_table :orders do |t|
      t.belongs_to :user, null: true, foreign_key: true
      t.string :status, null: false
      t.string :stripe_id, null: false

      t.timestamps
    end
  end
end
