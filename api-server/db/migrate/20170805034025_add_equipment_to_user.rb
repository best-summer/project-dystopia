class AddEquipmentToUser < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :equipment1, :stinga, :default => 'None'
    add_column :users, :equipment2, :sting, :default => 'None'
  end
end
