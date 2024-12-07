class AddCompletedAtToOrders < ActiveRecord::Migration[8.0]
  def change
    add_column :orders, :completed_at, :datetime
  end
end
