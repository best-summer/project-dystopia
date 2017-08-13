class Remove < ActiveRecord::Migration[5.0]
  def change
    remove_column :users, :summer_vacation_days, :integer
  end
end
