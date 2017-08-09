class CreateItems < ActiveRecord::Migration[5.0]
  def change
    create_table :items do |t|
      t.string :device_id
      t.integer :value
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
