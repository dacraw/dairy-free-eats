class MakeRecoveryPasswordDigestRequired < ActiveRecord::Migration[7.2]
  def change
    change_column_null :users, :recovery_password_digest, false
    add_index :users, :recovery_password_digest, unique: true
  end
end
