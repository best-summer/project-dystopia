class AddPasswordToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :password, :string
    # add_index  :users, [:client_id, :name], unique: true
  end
end
