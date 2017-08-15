require 'test_helper'

class ResultsControllerTest < ActionDispatch::IntegrationTest
  test "should get show" do
    get results_show_url
    assert_response :success
  end

  test "should get update" do
    get results_update_url
    assert_response :success
  end

end
