class CreateUsers < ActiveRecord::Migration[7.2]
  def change
    create_table :users do |t|
      t.string :email
      t.string :stripe_customer_id
      t.string :password_digest

      t.timestamps
    end
  end
end
