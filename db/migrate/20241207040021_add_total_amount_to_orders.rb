class AddTotalAmountToOrders < ActiveRecord::Migration[8.0]
  def change
    add_column :orders, :amount_total, :integer
  end
end
