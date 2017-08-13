class Item < ApplicationRecord
  belongs_to :user
  validates :user_id, uniqueness: {scope: [:name]}
  validates :name, :value, :user_id, presence: true
end
