class CreateNotifications < ActiveRecord::Migration[8.0]
  def change
    create_table :notifications do |t|
      t.belongs_to :user, null: false, foreign_key: true
      t.string :message, null: false
      t.string :path, null: true
      
      t.timestamps
    end
  end
end
