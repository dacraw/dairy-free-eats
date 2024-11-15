class AddGuestEmailToOrders < ActiveRecord::Migration[8.0]
  def change
    add_column :orders, :guest_email, :text, null: true
  end
end
