class CreateOrderMessages < ActiveRecord::Migration[8.0]
  def change
    create_table :order_messages do |t|
      t.belongs_to :order, null: false, foreign_key: true
      t.belongs_to :user, null: false, foreign_key: true
      t.text :body

      t.timestamps
    end
  end
end
