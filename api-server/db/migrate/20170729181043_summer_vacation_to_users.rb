class SummerVacationToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :summer_vacation_days, :integer
  end
end
