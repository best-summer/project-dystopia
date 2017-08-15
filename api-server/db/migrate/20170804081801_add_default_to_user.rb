class AddDefaultToUser < ActiveRecord::Migration[5.0]
  def change
    change_column :users, :score, :integer, :default => 0
    change_column :users, :rank, :string, :default => 'C'
    change_column :users, :billing, :integer, :default => 0
    change_column :users, :win_count, :integer, :default => 0
    change_column :users, :lose_count, :integer, :default => 0
    change_column :users, :summer_vacation_days, :integer, :default => 0
  end
end
