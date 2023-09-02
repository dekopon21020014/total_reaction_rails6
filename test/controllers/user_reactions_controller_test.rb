require "test_helper"

class UserReactionsControllerTest < ActionDispatch::IntegrationTest
  test "should get new" do
    get user_reactions_new_url
    assert_response :success
  end
end
