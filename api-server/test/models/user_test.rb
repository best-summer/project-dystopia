require 'test_helper'

class UserTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end

  def setup
    @user = User.new(name: "Suzukaze Aoba")
  end

  # test "should be valid" do
  #   assert @user.valid?
  # end

  test "name should be present" do
    @user.name = ""
    assert_not @user.valid?
  end

  test "client_id should be present" do
    @user.client_id = ""
    assert_not @user.client_id?
  end
end


