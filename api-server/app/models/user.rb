require 'securerandom'
class User < ApplicationRecord
  has_many :item
  validates :name,:client_id, :password, presence: true, uniqueness: true

  def create_password
    update_attribute(:password, SecureRandom.base64(8))
  end

end
