class AddOrderLineItemsToOrders < ActiveRecord::Migration[8.0]
  def change
    add_column :orders, :stripe_checkout_session_line_items, :json
  end
end
