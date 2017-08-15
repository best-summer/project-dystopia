class AddNumberToItems < ActiveRecord::Migration[5.0]
  def change
    add_column :items, :number, :integer
  end
end
