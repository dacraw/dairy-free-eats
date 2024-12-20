class AddSessionTokenToUsers < ActiveRecord::Migration[7.2]
  def change
    add_column :users, :session_token, :string, null: false
    add_index :users, :session_token, unique: true
  end
end
