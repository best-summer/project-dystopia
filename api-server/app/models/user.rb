require 'securerandom'
class User < ApplicationRecord
  has_many :item
  validates :name,:client_id, :password, presence: true, uniqueness: true

  def create_password
    # update_attributes(password:, SecureRandom.base64(8))
    write_attribute(:password, SecureRandom.base64(8))

    # update_attributes(name: "The Dude", password: "dude@abides.org")
  end

end
