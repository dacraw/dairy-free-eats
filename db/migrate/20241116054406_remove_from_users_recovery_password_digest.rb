class RemoveFromUsersRecoveryPasswordDigest < ActiveRecord::Migration[8.0]
  def change
    remove_column :users, :recovery_password_digest
  end
end
