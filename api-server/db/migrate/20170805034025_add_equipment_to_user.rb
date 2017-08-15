class AddEquipmentToUser < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :equipment1, :string, :default => 'None'
    add_column :users, :equipment2, :string, :default => 'None'
  end
end
