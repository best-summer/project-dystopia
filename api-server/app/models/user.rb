class User < ApplicationRecord
  has_many :item
  validates :name,:client_id, presence: true, uniqueness: true

end
