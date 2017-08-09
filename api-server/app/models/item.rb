class Item < ApplicationRecord
  validates :name, uniqueness: true
  validates :name, :value, :number, :user_id, presence: true
  belongs_to :user
end
