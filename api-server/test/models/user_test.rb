require 'test_helper'

class UserTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end

  def setup
    @user = User.new(name: "Suzukaze Aoba", client_id: "114514", password: "foobar")
  end

  test "should be valid" do
    assert @user.valid?
  end

  test "name should be present" do
    @user.name = ""
    assert_not @user.valid?
  end

  test "client_id should be present" do
    @user.client_id = ""
    assert_not @user.client_id?
  end

  test "name and client_id should be unique" do
    duplicate_user = @user.dup
    @user.save
    assert_not duplicate_user.valid?
  end

  test "password should be preset" do
    @user.password = ""
    assert_not @user.valid?
  end

end


