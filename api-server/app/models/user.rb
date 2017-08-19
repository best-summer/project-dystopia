require 'securerandom'
class User < ApplicationRecord
  has_many :item
  # validates :login_key, :device_id, presence: true, uniqueness: true
  validates :device_id, presence: true, uniqueness: true

  # ログインキーを生成する
  def create_login_key
    write_attribute(:login_key, SecureRandom.base64(8))
    # デバッグ用に同じ値を利用する
    # write_attribute(:login_key, "LOGINKEY")
  end

  # デバイスIDとログインキーの一致を確認する
  def authenticate?(params)
    self.device_id == params[:device_id] && self.login_key == params[:login_key]
  end

  # ログインキーの一致を確認する
  def authenticate_only_login_key?(params)
    self.login_key == params[:login_key]
  end
end
