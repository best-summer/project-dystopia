class Item < ApplicationRecord
  validates :name, :value, :user_id, presence: true
  belongs_to :user
end
