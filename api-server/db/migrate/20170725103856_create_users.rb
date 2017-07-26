class CreateUsers < ActiveRecord::Migration[5.0]
  def change
    create_table :users do |t|
      t.string :client_id
      t.string :name
      t.integer :score
      t.integer :billing
      t.integer :rank

      t.timestamps
    end
  end
end
