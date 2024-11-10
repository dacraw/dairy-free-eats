class ChangeOrdersStatusTypeToInteger < ActiveRecord::Migration[8.0]
  def change
    change_column :orders, :status, "integer USING status::integer"
  end
end
