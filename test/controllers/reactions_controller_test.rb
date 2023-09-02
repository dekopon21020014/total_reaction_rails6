require "test_helper"

class ReactionsControllerTest < ActionDispatch::IntegrationTest
  test "should get new" do
    get reactions_new_url
    assert_response :success
  end

  test "should get index" do
    get reactions_index_url
    assert_response :success
  end

  test "should get show" do
    get reactions_show_url
    assert_response :success
  end

  test "should get edit" do
    get reactions_edit_url
    assert_response :success
  end
end
