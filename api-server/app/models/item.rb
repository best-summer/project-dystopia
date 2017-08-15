class Item < ApplicationRecord
  belongs_to :user
  validates :user_id, uniqueness: {scope: [:name]} # 各ユーザは同じアイテムを一つしか持てない
  validates :name, :value, :user_id, presence: true
end
