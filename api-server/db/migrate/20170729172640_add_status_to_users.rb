class AddStatusToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :win_count, :integer
    add_column :users, :lose_count, :integer
end
