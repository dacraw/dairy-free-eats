class AddIndexToEmailUsers < ActiveRecord::Migration[7.2]
  def change
    add_index :users, :email, unique: true
    change_column_null :users, :email, false
  end
end
