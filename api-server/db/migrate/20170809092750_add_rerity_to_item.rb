class AddRerityToItem < ActiveRecord::Migration[5.0]
  def change
    add_column :items, :rarity, :string, :default => 'None'
  end
end
