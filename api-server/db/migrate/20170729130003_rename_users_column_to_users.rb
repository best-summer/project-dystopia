class RenameUsersColumnToUsers < ActiveRecord::Migration[5.0]
  def change
    rename_column :users, :client_id, :device_id
    rename_column :users, :password, :login_key
  end
end
