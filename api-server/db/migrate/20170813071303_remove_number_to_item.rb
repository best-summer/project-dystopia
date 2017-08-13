class RemoveNumberToItem < ActiveRecord::Migration[5.0]
  def change
    remove_column :items, :number, :integer
  end
end
