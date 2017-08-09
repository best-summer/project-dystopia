class AddPasswordToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :password, :string
    add_index :users, :device_id, unique: true
  end
end
