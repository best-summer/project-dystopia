class Item < ApplicationRecord
  validates :name, :value, :number, :user_id, presence: true
  belongs_to :user
end
