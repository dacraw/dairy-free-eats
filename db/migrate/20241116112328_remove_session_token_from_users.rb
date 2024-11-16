class RemoveSessionTokenFromUsers < ActiveRecord::Migration[8.0]
  def change
    remove_column :users, :session_token
  end
end
